<template>
  <div class="admin-finance-management container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <h1 class="my-4">Quản Lý Tài Chính</h1>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Bảng Gói Dịch Vụ -->
    <div class="subscription-management mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản Lý Gói Dịch Vụ</h2>
        <button @click="openSubscriptionModal('add')" class="btn btn-success">
          <i class="fas fa-plus me-1"></i> Thêm Gói Dịch Vụ Mới
        </button>
      </div>

      <div class="table-responsive">
        <table v-if="subscriptionPackages.length" class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th>STT</th>
              <th>Tên Gói</th>
              <th>Giá (VND)</th>
              <th>Thời Hạn (tháng)</th>
              <th>Mô Tả</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pkg, index) in subscriptionPackages" :key="pkg.id">
              <td>{{ index + 1 }}</td>
              <td>{{ pkg.name }}</td>
              <td>{{ formatCurrency(pkg.price) }}</td>
              <td>{{ pkg.duration }}</td>
              <td>{{ pkg.description }}</td>
              <td>
                <span :class="getStatusBadgeClass(pkg.status)">
                  {{ getStatusText(pkg.status) }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button @click="openSubscriptionModal('edit', pkg)" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDeleteSubscription(pkg.id)" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center my-4">
          <p class="text-muted">Không có gói dịch vụ nào.</p>
        </div>
      </div>
    </div>

    <!-- Bảng Theo Dõi Công Nợ -->
    <div class="debt-management">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Theo Dõi Công Nợ</h2>
        <button @click="openDebtModal" class="btn btn-success">
          <i class="fas fa-plus me-1"></i> Thêm Công Nợ
        </button>
      </div>

      <!-- Bộ lọc -->
      <div class="filters mb-4 row">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input type="text" v-model="searchDebt" @input="filterDebts" placeholder="Tìm kiếm chủ trọ..."
              class="form-control" />
          </div>
        </div>
        <div class="col-md-4">
          <select v-model="filterOptions.status" @change="filterDebts" class="form-select">
            <option value="all">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="itemsPerPage" @change="filterDebts" class="form-select">
            <option :value="10">10 dòng/trang</option>
            <option :value="20">20 dòng/trang</option>
            <option :value="50">50 dòng/trang</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table v-if="filteredDebts.length" class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th>STT</th>
              <th>Chủ Trọ</th>
              <th>Gói Dịch Vụ</th>
              <th>Ngày Đăng Ký</th>
              <th>Ngày Hết Hạn</th>
              <th>Số Tiền (VND)</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(debt, index) in paginatedDebts" :key="debt.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ debt.landlordName }}</td>
              <td>{{ debt.packageName }}</td>
              <td>{{ formatDate(debt.startDate) }}</td>
              <td>{{ formatDate(debt.endDate) }}</td>
              <td>{{ formatCurrency(debt.amount) }}</td>
              <td>
                <span :class="getPaymentStatusBadgeClass(debt.status)">
                  {{ debt.status === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán' }}
                </span>
              </td>
              <td>
                <button v-if="debt.status === 'unpaid'" @click="markAsPaid(debt.id)" class="btn btn-success btn-sm">
                  <i class="fas fa-check me-1"></i> Thanh Toán
                </button>
                <span v-else class="text-muted">
                  <i class="fas fa-check-circle"></i> Đã thanh toán
                </span>
              </td>

            </tr>
          </tbody>
        </table>
        <div v-else class="text-center my-4">
          <p class="text-muted">Không có công nợ nào.</p>
        </div>
      </div>

      <!-- Modal Thêm Công Nợ -->
      <div v-if="showDebtModal" class="modal fade show d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm Công Nợ</h5>
              <button type="button" class="btn-close" @click="closeDebtModal"></button>
            </div>
            <form @submit.prevent="addDebt">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label required">Chủ Trọ</label>
                  <select v-model="newDebt.landlordId" class="form-select" required>
                    <option value="" disabled>Chọn Chủ Trọ</option>
                    <option v-for="landlord in landlords" :key="landlord.id" :value="landlord.id">
                      {{ landlord.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label required">Gói Dịch Vụ</label>
                  <select v-model="newDebt.packageId" class="form-select" required>
                    <option value="" disabled>Chọn Gói Dịch Vụ</option>
                    <option v-for="pkg in subscriptionPackages" :key="pkg.id" :value="pkg.id">
                      {{ pkg.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label required">Ngày Đăng Ký</label>
                  <input type="date" v-model="newDebt.startDate" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label required">Ngày Hết Hạn</label>
                  <input type="date" v-model="newDebt.endDate" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label required">Số Tiền (VND)</label>
                  <input type="number" v-model="newDebt.amount" class="form-control" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label required">Trạng Thái</label>
                  <select v-model="newDebt.status" class="form-select">
                    <option value="unpaid">Chưa Thanh Toán</option>
                    <option value="paid">Đã Thanh Toán</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeDebtModal">
                  Hủy
                </button>
                <button type="submit" class="btn btn-success">Thêm Công Nợ</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal Thêm/Sửa Gói Dịch Vụ -->
    <div v-if="showSubscriptionModal" class="modal fade show d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? "Sửa Gói Dịch Vụ" : "Thêm Gói Dịch Vụ Mới" }}
            </h5>
            <button type="button" class="btn-close" @click="closeSubscriptionModal"></button>
          </div>
          <form @submit.prevent="isEditing ? updateSubscription() : addSubscription()">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label required">Tên Gói</label>
                <input type="text" v-model="modalPackage.name" class="form-control"
                  :class="{ 'is-invalid': validationErrors.name }" required />
                <div class="invalid-feedback">{{ validationErrors.name }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label required">Giá (VND)</label>
                <input type="number" v-model="modalPackage.price" class="form-control"
                  :class="{ 'is-invalid': validationErrors.price }" required min="0" />
                <div class="invalid-feedback">{{ validationErrors.price }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label required">Thời Hạn (tháng)</label>
                <input type="number" v-model="modalPackage.duration" class="form-control"
                  :class="{ 'is-invalid': validationErrors.duration }" required min="1" />
                <div class="invalid-feedback">{{ validationErrors.duration }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Mô Tả</label>
                <textarea v-model="modalPackage.description" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng Thái</label>
                <select v-model="modalPackage.status" class="form-select">
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeSubscriptionModal">
                <i class="fas fa-times me-1"></i> Hủy
              </button>
              <button type="submit" class="btn btn-success" :disabled="loading">
                <i class="fas fa-save me-1"></i>
                {{ isEditing ? "Cập nhật" : "Thêm" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import "@/styles/admin/financial-management.css";
import { ref } from "vue";

export default {
  name: "AdminFinancialManagement",

  setup() {
    const loading = ref(false);
    const error = ref(null);
    return { loading, error };
  },

  data() {
    return {
      apiBaseUrl: "https://6725a513c39fedae05b5670b.mockapi.io/api/v1",
      subscriptionPackages: [],
      debts: [],
      filteredDebts: [],
      showSubscriptionModal: false,
      showDebtModal: false,
      isEditing: false,
      modalPackage: this.getEmptyModalPackage(),
      newDebt: this.getEmptyDebt(),
      searchDebt: "",
      currentPage: 1,
      itemsPerPage: 10,
      filterOptions: { status: "all" },
      validationErrors: {},
    };
  },

  computed: {
    paginatedDebts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDebts.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredDebts.length / this.itemsPerPage);
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;
      for (let i = 1; i <= this.totalPages; i++) {
        if (i === 1 || i === this.totalPages || (i >= this.currentPage - delta && i <= this.currentPage + delta)) {
          range.push(i);
        }
      }
      range.forEach(i => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      });
      return rangeWithDots;
    }
  },

  watch: {
    // Watch for changes in the selected package ID
    "newDebt.packageId"(newPackageId) {
      const selectedPackage = this.subscriptionPackages.find(pkg => pkg.id === newPackageId);
      if (selectedPackage) {
        this.newDebt.amount = selectedPackage.price;  // Update the amount with the package price
      } else {
        this.newDebt.amount = 0;  // Reset amount if no package is selected
      }
    }
  },


  methods: {
    async fetchDropdownData() {
      try {
        this.loading = true;
        const usersResponse = await fetch(`${this.apiBaseUrl}/users`);
        const users = await usersResponse.json();
        this.landlords = users.filter(user => user.role === "landlord");

        const packagesResponse = await fetch(`${this.apiBaseUrl}/subscription-packages`);
        this.subscriptionPackages = await packagesResponse.json();
      } catch (error) {
        this.handleError(error, "Cannot load dropdown data");
      } finally {
        this.loading = false;
      }
    },


    getEmptyModalPackage() {
      return {
        id: null,
        name: "",
        price: 0,
        duration: 1,
        description: "",
        status: "active"
      };
    },

    getEmptyDebt() {
      return {
        landlordId: "",
        packageId: "",
        startDate: "",
        endDate: "",
        amount: 0,
        status: "unpaid",
        landlordName: "",
        packageName: ""
      };
    },

    validatePackage() {
      const errors = {};

      if (!this.modalPackage.name.trim()) errors.name = 'Tên gói không được để trống';
      if (this.modalPackage.price <= 0) errors.price = 'Giá phải lớn hơn 0';
      if (this.modalPackage.duration < 1) errors.duration = 'Thời hạn phải từ 1 tháng trở lên';

      this.validationErrors = errors;
      return Object.keys(errors).length === 0;
    },

    validateDebt() {
      const errors = {};
      if (!this.newDebt.landlordName.trim()) errors.landlordName = "Vui lòng nhập tên chủ trọ";
      if (!this.newDebt.packageName.trim()) errors.packageName = "Vui lòng nhập tên gói dịch vụ";
      if (!this.newDebt.startDate) errors.startDate = "Vui lòng chọn ngày đăng ký";
      if (!this.newDebt.endDate) errors.endDate = "Vui lòng chọn ngày hết hạn";
      if (this.newDebt.amount <= 0) errors.amount = "Số tiền phải lớn hơn 0";

      this.validationErrors = errors;
      return Object.keys(errors).length === 0;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN");
    },

    getStatusBadgeClass(status) {
      return { "badge rounded-pill": true, "bg-success": status === "active", "bg-secondary": status === "inactive" };
    },

    getPaymentStatusBadgeClass(status) {
      return { "badge rounded-pill": true, "bg-success": status === "paid", "bg-danger": status === "unpaid" };
    },

    getStatusText(status) {
      return status === "active" ? "Đang hoạt động" : "Tạm ngưng";
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },

    filterDebts() {
      let filtered = this.debts;
      if (this.searchDebt) {
        const searchLower = this.searchDebt.toLowerCase();
        filtered = filtered.filter(debt =>
          debt.landlordName.toLowerCase().includes(searchLower) ||
          debt.packageName.toLowerCase().includes(searchLower)
        );
      }
      if (this.filterOptions.status !== "all") {
        filtered = filtered.filter(debt => debt.status === this.filterOptions.status);
      }
      this.filteredDebts = filtered;
      this.currentPage = 1;
    },

    confirmDeleteSubscription(id) {
      Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa gói dịch vụ này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loading = true;
            await fetch(`${this.apiBaseUrl}/subscription-packages/${id}`, { method: "DELETE" });
            await this.fetchSubscriptionPackages();
            this.showSuccessMessage("Xóa gói dịch vụ thành công");
          } catch (error) {
            this.handleError(error, "Không thể xóa gói dịch vụ");
          } finally {
            this.loading = false;
          }
        }
      });
    },


    async fetchSubscriptionPackages() {
      try {
        this.loading = true;
        const response = await fetch(`${this.apiBaseUrl}/subscription-packages`);
        this.subscriptionPackages = await response.json();
      } catch (error) {
        this.handleError(error, "Không thể tải danh sách gói dịch vụ");
      } finally {
        this.loading = false;
      }
    },

    async fetchDebts() {
      try {
        this.loading = true;
        const response = await fetch(`${this.apiBaseUrl}/debts`);
        this.debts = await response.json();
        this.filteredDebts = this.debts;
      } catch (error) {
        this.handleError(error, "Không thể tải danh sách công nợ");
      } finally {
        this.loading = false;
      }
    },

    async addSubscription() {
      if (!this.validatePackage()) return;

      try {
        this.loading = true;
        await fetch(`${this.apiBaseUrl}/subscription-packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.modalPackage)
        });

        await this.fetchSubscriptionPackages();
        this.closeSubscriptionModal();
        this.showSuccessMessage("Gói dịch vụ mới đã được thêm thành công");
      } catch (error) {
        this.handleError(error, 'Không thể thêm gói dịch vụ');
      } finally {
        this.loading = false;
      }
    },

    async updateSubscription() {
      if (!this.validatePackage()) return;

      try {
        this.loading = true;
        await fetch(`${this.apiBaseUrl}/subscription-packages/${this.modalPackage.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.modalPackage)
        });
        await this.fetchSubscriptionPackages();
        this.closeSubscriptionModal();
        this.showSuccessMessage("Cập nhật gói dịch vụ thành công");
      } catch (error) {
        this.handleError(error, "Không thể cập nhật gói dịch vụ");
      } finally {
        this.loading = false;
      }
    },

    async deleteSubscription(id) {
      Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa gói dịch vụ này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loading = true;
            await fetch(`${this.apiBaseUrl}/subscription-packages/${id}`, { method: "DELETE" });
            await this.fetchSubscriptionPackages();
            this.showSuccessMessage("Xóa gói dịch vụ thành công");
          } catch (error) {
            this.handleError(error, "Không thể xóa gói dịch vụ");
          } finally {
            this.loading = false;
          }
        }
      });
    },

    async addDebt() {
      if (!this.newDebt.landlordId || !this.newDebt.packageId) {
        this.handleError(null, "Vui lòng chọn chủ trọ và gói dịch vụ");
        return;
      }

      try {
        this.loading = true;

        // Lấy thông tin chủ trọ và gói dịch vụ
        const selectedLandlord = this.landlords.find(l => l.id === this.newDebt.landlordId);
        const selectedPackage = this.subscriptionPackages.find(p => p.id === this.newDebt.packageId);

        // Tạo object debt để gửi lên server
        const debtData = {
          landlordId: this.newDebt.landlordId,
          landlordName: selectedLandlord.name,
          packageId: this.newDebt.packageId,
          packageName: selectedPackage.name,
          startDate: this.newDebt.startDate,
          endDate: this.newDebt.endDate,
          amount: this.newDebt.amount,
          status: this.newDebt.status
        };

        const response = await fetch(`${this.apiBaseUrl}/debts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(debtData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newDebt = await response.json();
        this.debts.push(newDebt);
        this.filterDebts();
        this.closeDebtModal();
        this.showSuccessMessage("Thêm công nợ mới thành công");
      } catch (error) {
        this.handleError(error, "Không thể thêm công nợ");
      } finally {
        this.loading = false;
      }
    },


    async markAsPaid(debtId) {
      Swal.fire({
        title: "Xác nhận thanh toán",
        text: "Bạn có chắc chắn muốn đánh dấu công nợ này là đã thanh toán?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loading = true;
            await fetch(`${this.apiBaseUrl}/debts/${debtId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "paid" })
            });
            await this.fetchDebts();
            Swal.fire("Thành công!", "Đã đánh dấu là đã thanh toán.", "success");
          } catch (error) {
            this.handleError(error, "Không thể cập nhật trạng thái thanh toán");
          } finally {
            this.loading = false;
          }
        }
      });
    },

    openDebtModal() {
      this.fetchDropdownData();
      this.newDebt = this.getEmptyDebt();
      this.showDebtModal = true;
    },

    closeDebtModal() {
      this.showDebtModal = false;
    },

    openSubscriptionModal(mode, packageData = null) {
      this.isEditing = mode === "edit";
      this.modalPackage = packageData ? { ...packageData } : this.getEmptyModalPackage();
      this.showSubscriptionModal = true;
      this.validationErrors = {};
    },

    closeSubscriptionModal() {
      this.showSubscriptionModal = false;
      this.modalPackage = this.getEmptyModalPackage();
      this.validationErrors = {};
    },

    showSuccessMessage(message) {
      Swal.fire({ icon: "success", title: "Thành công", text: message, timer: 1500, showConfirmButton: false });
    },

    handleError(error, message) {
      console.error(error);
      this.error = message;
      Swal.fire({ icon: "error", title: "Lỗi", text: message });
    }
  },

  async mounted() {
    await Promise.all([this.fetchSubscriptionPackages(), this.fetchDebts()]);
  }
};

</script>

<style scoped>
.admin-finance-management {
  padding: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.table-responsive {
  margin-bottom: 1rem;
}

.table th {
  white-space: nowrap;
}

.btn-group .btn {
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.form-label.required::after {
  content: "*";
  color: red;
  margin-left: 4px;
}

.badge {
  padding: 0.5em 0.75em;
}

.pagination {
  margin-bottom: 0;
}

.pagination .page-link {
  padding: 0.375rem 0.75rem;
}

.filters {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.25rem;
}

.input-group-text {
  background-color: #fff;
}

@media (max-width: 768px) {
  .filters .col-md-4 {
    margin-bottom: 1rem;
  }

  .filters .col-md-4:last-child {
    margin-bottom: 0;
  }
}
</style>