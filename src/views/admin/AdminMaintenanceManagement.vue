<template>
  <div class="maintenance-management">
    <h1>Quản lý Bảo trì</h1>

    <!-- Thanh tìm kiếm và bộ lọc -->
    <div class="search-and-filters">
      <div class="search-bar">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm kiếm hợp đồng bảo trì..." />
        <button class="btn btn-primary">
          <i class="fas fa-search"></i> Tìm kiếm
        </button>
      </div>

      <div class="filters">
        <select v-model="statusFilter" class="form-select">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm ngưng</option>
          <option value="expired">Đã hết hạn</option>
        </select>

        <div class="date-filters">
          <div class="date-group">
            <label>Từ ngày:</label>
            <input type="date" v-model="dateFilter.start" class="form-control" />
          </div>
          <div class="date-group">
            <label>Đến ngày:</label>
            <input type="date" v-model="dateFilter.end" class="form-control" />
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <button @click="openAddModal" class="btn btn-success">
        <i class="fas fa-plus"></i> Thêm hợp đồng bảo trì
      </button>
      <div class="view-options">
        <select v-model="itemsPerPage" class="form-select">
          <option :value="10">10 dòng/trang</option>
          <option :value="20">20 dòng/trang</option>
          <option :value="50">50 dòng/trang</option>
        </select>
      </div>
    </div>

    <!-- Bảng hiển thị -->
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Tên Hợp Đồng</th>
            <th>Ngày Bắt Đầu</th>
            <th>Ngày Kết Thúc</th>
            <th>Trạng Thái</th>
            <th>Thời Hạn Còn Lại</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contract, index) in paginatedContracts" :key="contract.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ contract.name }}</td>
            <td>{{ contract.startDate }}</td>
            <td>{{ contract.endDate }}</td>
            <td>
              <span :class="getStatusBadgeClass(contract.status)">
                {{ contract.status }}
              </span>
            </td>
            <td>
              <span class="badge bg-info">
                {{ getRemainingDays(contract.endDate) }}
              </span>
            </td>
            <td class="actions">
              <button @click="openEditModal(contract)" class="btn btn-primary btn-sm">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="handleDelete(contract.id)" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
              <button @click="viewDetails(contract)" class="btn btn-info btn-sm">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="pagination-container">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">
            Previous
          </a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="handlePageChange(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage + 1)">
            Next
          </a>
        </li>
      </ul>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-lg">
        <!-- Thay đổi kích thước modal -->
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Sửa" : "Thêm" }} Hợp Đồng Bảo Trì
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
              <!-- Thông tin cơ bản -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label required">Mã Hợp Đồng</label>
                  <input v-model="form.code" type="text" class="form-control" :class="{ 'is-invalid': errors.code }"
                    required />
                  <div class="invalid-feedback">{{ errors.code }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Tên Hợp Đồng</label>
                  <input v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                    required />
                  <div class="invalid-feedback">{{ errors.name }}</div>
                </div>
              </div>

              <!-- Thông tin thời gian -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label required">Ngày Bắt Đầu</label>
                  <input v-model="form.startDate" type="date" class="form-control"
                    :class="{ 'is-invalid': errors.startDate }" required />
                  <div class="invalid-feedback">{{ errors.startDate }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label required">Ngày Kết Thúc</label>
                  <input v-model="form.endDate" type="date" class="form-control"
                    :class="{ 'is-invalid': errors.endDate }" required />
                  <div class="invalid-feedback">{{ errors.endDate }}</div>
                </div>
              </div>

              <!-- Thông tin khách hàng -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label required">Khách Hàng</label>
                  <select v-model="form.customerId" class="form-select" :class="{ 'is-invalid': errors.customerId }"
                    required>
                    <option value="">Chọn khách hàng</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                      {{ customer.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.customerId }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label required">Trạng Thái</label>
                  <select v-model="form.status" class="form-select" :class="{ 'is-invalid': errors.status }" required>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                    <option value="expired">Đã hết hạn</option>
                  </select>
                  <div class="invalid-feedback">{{ errors.status }}</div>
                </div>
              </div>

              <!-- Thông tin tài chính -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label required">Giá Trị Hợp Đồng (VNĐ)</label>
                  <input v-model="form.value" type="number" class="form-control" :class="{ 'is-invalid': errors.value }"
                    required />
                  <div class="invalid-feedback">{{ errors.value }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Chu Kỳ Thanh Toán</label>
                  <select v-model="form.paymentCycle" class="form-select">
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                    <option value="yearly">Hàng năm</option>
                  </select>
                </div>
              </div>

              <!-- Mô tả và ghi chú -->
              <div class="mb-3">
                <label class="form-label">Mô Tả Chi Tiết</label>
                <textarea v-model="form.description" class="form-control" rows="4" placeholder="Nhập mô tả chi tiết...">
                </textarea>
              </div>

              <!-- File đính kèm -->
              <div class="mb-3">
                <label class="form-label">Tài Liệu Đính Kèm</label>
                <div class="input-group">
                  <input type="file" class="form-control" @change="handleFileUpload" multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx" />
                </div>
                <small class="text-muted">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX (Tối đa 5MB/file)</small>

                <!-- Hiển thị file đã upload -->
                <div v-if="form.attachments.length" class="mt-2">
                  <div v-for="(file, index) in form.attachments" :key="index" class="d-flex align-items-center mb-1">
                    <i class="fas fa-file me-2"></i>
                    <span>{{ file.name }}</span>
                    <button type="button" class="btn btn-link text-danger p-0 ms-2" @click="removeFile(index)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                  {{ isEditing ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Hợp Đồng -->
    <div v-if="showDetailsModal" class="modal fade show" style="display: block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi Tiết Hợp Đồng Bảo Trì</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Mã Hợp Đồng:</strong> {{ selectedContract.code }}</p>
            <p><strong>Tên Hợp Đồng:</strong> {{ selectedContract.name }}</p>
            <p>
              <strong>Ngày Bắt Đầu:</strong> {{ selectedContract.startDate }}
            </p>
            <p>
              <strong>Ngày Kết Thúc:</strong> {{ selectedContract.endDate }}
            </p>
            <p><strong>Trạng Thái:</strong> {{ selectedContract.status }}</p>
            <p>
              <strong>Khách Hàng:</strong> {{ selectedContract.customerId }}
            </p>
            <p>
              <strong>Giá Trị Hợp Đồng (VNĐ):</strong>
              {{ selectedContract.value }}
            </p>
            <p>
              <strong>Chu Kỳ Thanh Toán:</strong>
              {{ selectedContract.paymentCycle }}
            </p>
            <p>
              <strong>Mô Tả Chi Tiết:</strong>
              {{ selectedContract.description }}
            </p>
            <!-- Hiển thị các tài liệu đính kèm -->
            <div v-if="
              selectedContract.attachments &&
              selectedContract.attachments.length
            ">
              <p><strong>Tài Liệu Đính Kèm:</strong></p>
              <ul>
                <li v-for="(file, index) in selectedContract.attachments" :key="index">
                  <a :href="file.url" target="_blank">{{ file.name }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "AdminMaintenanceManagement",
  data() {
    return {
      apiBaseUrl: "https://6725a513c39fedae05b5670b.mockapi.io/api/v1",
      contracts: [],
      searchQuery: "",
      statusFilter: "",
      dateFilter: { start: "", end: "" },
      itemsPerPage: 10,
      currentPage: 1,
      showModal: false,
      showDetailsModal: false,
      isEditing: false,
      selectedContract: null,
      maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
      allowedFileTypes: [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
      form: {
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        status: "active",
        customerId: "",
        value: "",
        paymentCycle: "monthly",
        description: "",
        attachments: [],
      },
      errors: {},
      isSubmitting: false,
      customers: [],
    };
  },

  computed: {
    filteredContracts() {
      let filtered = [...this.contracts];

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (contract) =>
            contract.name.toLowerCase().includes(searchLower) ||
            contract.code.toLowerCase().includes(searchLower)
        );
      }

      // Lọc theo trạng thái
      if (this.statusFilter) {
        filtered = filtered.filter(
          (contract) => contract.status === this.statusFilter
        );
      }

      // Lọc theo khoảng thời gian
      if (this.dateFilter.start) {
        const startDate = new Date(this.dateFilter.start);
        filtered = filtered.filter(
          (contract) => new Date(contract.startDate) >= startDate
        );
      }

      if (this.dateFilter.end) {
        const endDate = new Date(this.dateFilter.end);
        filtered = filtered.filter(
          (contract) => new Date(contract.endDate) <= endDate
        );
      }

      return filtered;
    },

    paginatedContracts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredContracts.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredContracts.length / this.itemsPerPage);
    },
  },

  methods: {
    async loadCustomers() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/users`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const users = await response.json();

        // Lọc khách hàng có role là "landlord"
        this.customers = users.filter(user => user.role === 'landlord');
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể tải danh sách khách hàng.', 'error');
      }
    },

    async uploadToCloudinary(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "cozy-home");
      formData.append("cloud_name", "djnt4wlng");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/djnt4wlng/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Cloudinary upload error:", errorData);
          throw new Error("Upload file không thành công");
        }

        const data = await response.json();
        return data.secure_url; // Trả về URL của file đã upload
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    },

    async handleFileUpload(event) {
      const files = Array.from(event.target.files);
      const uploadedFiles = [];
      const errors = [];

      for (const file of files) {
        if (file.size > this.maxFileSize) {
          errors.push(`File "${file.name}" vượt quá kích thước cho phép (5MB)`);
          continue;
        }

        const extension = "." + file.name.split(".").pop().toLowerCase();
        if (!this.allowedFileTypes.includes(extension)) {
          errors.push(`File "${file.name}" không đúng định dạng cho phép`);
          continue;
        }

        try {
          const url = await this.uploadToCloudinary(file); // Upload lên Cloudinary và lấy URL
          uploadedFiles.push({
            name: file.name,
            url: url, // URL từ Cloudinary
            size: this.formatFileSize(file.size),
            type: file.type,
          });
        } catch (error) {
          errors.push(`Không thể upload file "${file.name}" lên Cloudinary`);
        }
      }

      if (errors.length > 0) {
        Swal.fire({
          title: "Lỗi Upload File",
          html: errors.join("<br>"),
          icon: "error",
        });
      }

      // Cập nhật form.attachments với URL của file đã upload
      this.form.attachments = [...this.form.attachments, ...uploadedFiles];
    },

    removeFile(index) {
      if (this.form.attachments[index].url) {
        URL.revokeObjectURL(this.form.attachments[index].url); // Xóa URL tạm
      }
      this.form.attachments.splice(index, 1); // Xóa file khỏi danh sách
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    async uploadFiles(contractId) {
      const formData = new FormData();

      for (const attachment of this.form.attachments) {
        if (attachment.file) {
          formData.append("files", attachment.file);
        }
      }

      try {
        const response = await fetch(
          `${this.apiBaseUrl}/contracts-maintenance/${contractId}/attachments`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        throw new Error("Không thể upload files");
      }
    },

    // Lấy danh sách hợp đồng bảo trì
    async loadContracts() {
      try {
        const response = await fetch(
          `${this.apiBaseUrl}/contracts-maintenance`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        this.contracts = await response.json();
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể tải dữ liệu hợp đồng.", "error");
      }
    },

    getStatusBadgeClass(status) {
      return {
        badge: true,
        "bg-success": status === "active",
        "bg-warning": status === "inactive",
        "bg-danger": status === "expired",
      };
    },

    getRemainingDays(endDate) {
      const end = new Date(endDate);
      const today = new Date();
      const diff = end - today;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} ngày` : "Đã hết hạn";
    },

    // Thêm hợp đồng mới
    async addContract() {
      if (!await this.validateForm()) return;

      try {
        this.isSubmitting = true;

        // Tạo hợp đồng mới với ID khách hàng đã chọn
        const response = await fetch(`${this.apiBaseUrl}/contracts-maintenance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...this.form,
            attachments: this.form.attachments // Đảm bảo chứa URL của file đính kèm
          })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const newContract = await response.json();
        this.contracts.push(newContract);
        this.closeModal();
        this.loadContracts();
        Swal.fire('Thành công!', 'Hợp đồng mới đã được thêm.', 'success');
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể thêm hợp đồng.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },

    async updateContract() {
      if (!(await this.validateForm())) return;

      try {
        this.isSubmitting = true;

        const response = await fetch(
          `${this.apiBaseUrl}/contracts-maintenance/${this.form.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...this.form,
              attachments: this.form.attachments.filter((a) => !a.file), // Không gửi file mới trong payload JSON
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        // Upload các file mới nếu có
        const newFiles = this.form.attachments.filter((a) => a.file);
        if (newFiles.length > 0) {
          try {
            await this.uploadFiles(this.form.id);
          } catch (error) {
            Swal.fire(
              "Cảnh báo",
              "Hợp đồng đã được cập nhật nhưng không thể upload files đính kèm mới",
              "warning"
            );
          }
        }

        this.closeModal();
        this.loadContracts();
        Swal.fire("Thành công!", "Hợp đồng đã được cập nhật.", "success");
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể cập nhật hợp đồng.", "error");
      } finally {
        this.isSubmitting = false;
      }
    },

    async handleDelete(id) {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể khôi phục lại hợp đồng này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(
              `${this.apiBaseUrl}/contracts-maintenance/${id}`,
              { method: "DELETE" }
            );
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            this.loadContracts();
            Swal.fire("Đã xóa!", "Hợp đồng đã bị xóa.", "success");
          } catch (error) {
            Swal.fire("Lỗi!", "Không thể xóa hợp đồng.", "error");
          }
        }
      });
    },

    openAddModal() {
      this.isEditing = false;
      this.form = {
        code: "",
        name: "",
        startDate: "",
        endDate: "",
        status: "active",
        customerId: "",
        value: "",
        paymentCycle: "monthly",
        description: "",
        attachments: [],
      };
      this.errors = {};
      this.showModal = true;
    },

    openEditModal(contract) {
      this.isEditing = true;
      this.form = { ...contract };
      this.selectedContract = { ...contract }; // Lưu bản sao hợp đồng ban đầu để so sánh mã hợp đồng
      this.errors = {};
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.showDetailsModal = false;
      this.form = {};
      this.errors = {};
      this.selectedContract = null;
    },

    async validateForm() {
      let isValid = true;
      this.errors = {};

      // Kiểm tra mã hợp đồng
      if (!this.form.code) {
        this.errors.code = "Vui lòng nhập mã hợp đồng";
        isValid = false;
      } else if (
        !this.isEditing ||
        this.form.code !== this.selectedContract.code
      ) {
        // Chỉ kiểm tra trùng lặp nếu là thêm mới hoặc nếu mã hợp đồng thay đổi trong chế độ sửa
        if (await this.isDuplicateCode(this.form.code)) {
          this.errors.code = "Mã hợp đồng đã tồn tại";
          isValid = false;
        }
      }

      if (!this.form.name) {
        this.errors.name = "Vui lòng nhập tên hợp đồng";
        isValid = false;
      }
      if (!this.form.startDate) {
        this.errors.startDate = "Vui lòng chọn ngày bắt đầu";
        isValid = false;
      }
      if (!this.form.endDate) {
        this.errors.endDate = "Vui lòng chọn ngày kết thúc";
        isValid = false;
      }

      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      if (end <= start) {
        this.errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        isValid = false;
      }

      if (!this.form.value || this.form.value <= 0) {
        this.errors.value = "Vui lòng nhập giá trị hợp đồng hợp lệ";
        isValid = false;
      }

      return isValid;
    },

    // Kiểm tra mã hợp đồng trùng lặp
    async isDuplicateCode(code) {
      return this.contracts.some((contract) => contract.code === code);
    },

    viewDetails(contract) {
      this.selectedContract = contract;
      this.showDetailsModal = true;
    },

    handleSearch() {
      this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    },

    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    async handleSubmit() {
      if (this.isEditing) {
        await this.updateContract();
      } else {
        await this.addContract();
      }
    },
  },

  watch: {
    // Reset trang khi thay đổi bộ lọc
    statusFilter() {
      this.currentPage = 1;
    },
    "dateFilter.start"() {
      this.currentPage = 1;
    },
    "dateFilter.end"() {
      this.currentPage = 1;
    },
    itemsPerPage() {
      this.currentPage = 1;
    },
  },

  async mounted() {
    await this.loadContracts();
    await this.loadCustomers();
  },
};
</script>

<style scoped>
.maintenance-management {
  min-height: 100vh;
  margin-top: 80px;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-and-filters {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: center;
}

.date-filters {
  display: flex;
  gap: 15px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions .btn {
  margin-right: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.badge {
  padding: 6px 10px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .date-filters {
    flex-direction: column;
  }

  .toolbar {
    flex-direction: column;
    gap: 10px;
  }
}

.required:after {
  content: " *";
  color: red;
}

.modal-lg {
  max-width: 800px;
}

.ql-editor {
  min-height: 150px;
}
</style>
