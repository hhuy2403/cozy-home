<template>
  <div class="admin-user-management container">
    <h1 class="my-4">Quản Lý Người Dùng</h1>

    <!-- Form tìm kiếm người dùng -->
    <div class="input-group mb-4">
      <input type="text" v-model="searchTerm" @input="searchUsers"
        placeholder="Tìm kiếm người dùng qua email hoặc tên..." class="form-control" />
      <span v-if="isSearching" class="input-group-text">
        <i class="fas fa-spinner fa-spin"></i>
      </span>
    </div>

    <div class="d-flex mb-3">
      <select v-model="roleFilter" @change="paginateUsers" class="form-select me-2">
        <option value="">Tất cả vai trò</option>
        <option value="admin">Quản trị viên</option>
        <option value="landlord">Chủ nhà</option>
        <option value="tenant">Người thuê</option>
      </select>

      <select v-model="statusFilter" @change="paginateUsers" class="form-select">
        <option value="">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Vô hiệu hóa</option>
      </select>
    </div>


    <!-- Nút thêm người dùng và đặt lại bộ lọc -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <button @click="showAddUserModal = true" class="btn btn-success">
        <i class="fas fa-plus me-2"></i>Thêm người dùng mới
      </button>
      <button @click="resetFilters" class="btn btn-secondary">
        <i class="fas fa-redo me-2"></i>Đặt lại bộ lọc
      </button>
    </div>

    <!-- Danh sách người dùng -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-dark">
          <tr>
            <th @click="sortBy('id')">
              ID
              <i v-if="sortKey === 'id'" :class="['fas', sortAsc ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </th>
            <th @click="sortBy('name')">
              Tên
              <i v-if="sortKey === 'name'" :class="['fas', sortAsc ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </th>
            <th @click="sortBy('email')">
              Email
              <i v-if="sortKey === 'email'" :class="['fas', sortAsc ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </th>
            <th>Vai trò</th>
            <th @click="sortBy('status')">
              Trạng thái
              <i v-if="sortKey === 'status'" :class="['fas', sortAsc ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="6" class="text-center py-4">
              <i class="fas fa-spinner fa-spin me-2"></i> Đang tải...
            </td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="6" class="text-center py-4">
              <i class="fas fa-search me-2"></i> Không tìm thấy người dùng nào
            </td>
          </tr>
          <tr v-else v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name || "N/A" }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="changeUserRole(user.id, user.role)"
                class="form-select form-select-sm">
                <option value="admin">Quản trị viên</option>
                <option value="landlord">Chủ nhà</option>
                <option value="tenant">Người thuê</option>
              </select>
            </td>
            <td>
              <span :class="[
                'badge',
                user.status === 'active' ? 'bg-success' : 'bg-danger',
              ]">
                {{ user.status === "active" ? "Hoạt động" : "Vô hiệu hóa" }}
              </span>
            </td>
            <td>
              <div class="btn-group">
                <button @click="editUser(user)" class="btn btn-primary btn-sm">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDeleteUser(user.id)" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i>
                </button>
                <button @click="toggleUserStatus(user.id)" class="btn btn-sm" :class="user.status === 'active' ? 'btn-warning' : 'btn-success'
                  ">
                  <i :class="[
                    'fas',
                    user.status === 'active' ? 'fa-ban' : 'fa-check',
                  ]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Phân trang" v-if="filteredUsers.length > 0">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">
            <i class="fas fa-chevron-left"></i> Trang trước
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">Trang {{ currentPage }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">
            Trang sau <i class="fas fa-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal thêm/sửa người dùng -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal fade show" tabindex="-1" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="[
                'fas',
                showEditUserModal ? 'fa-edit' : 'fa-plus-circle',
                'me-2',
              ]"></i>
              {{ showEditUserModal ? "Sửa người dùng" : "Thêm người dùng mới" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
              <div class="mb-3">
                <label for="name" class="form-label required">Tên</label>
                <input type="text" id="name" v-model="modalUser.name" class="form-control"
                  :class="{ 'is-invalid': nameError }" required />
                <div class="invalid-feedback">{{ nameError }}</div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label required">Email</label>
                <input type="email" id="email" v-model="modalUser.email" class="form-control"
                  :class="{ 'is-invalid': emailError }" @blur="validateEmail" required />
                <div class="invalid-feedback">{{ emailError }}</div>
              </div>
              <div class="mb-3" v-if="!showEditUserModal">
                <label for="password" class="form-label required">Mật khẩu</label>
                <div class="input-group password-input-group">
                  <input :type="showPassword ? 'text' : 'password'" id="password" v-model="modalUser.password"
                    class="form-control" :class="{ 'is-invalid': passwordError }" @blur="validatePassword" required />
                  <button type="button" class="btn btn-outline-secondary password-toggle-btn"
                    @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                    <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                </div>
                <div class="invalid-feedback" v-if="passwordError">
                  {{ passwordError }}
                </div>
                <small class="text-muted">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường,
                  số và ký tự đặc biệt.
                </small>
              </div>

              <div class="mb-3">
                <label for="role" class="form-label required">Vai trò</label>
                <select id="role" v-model="modalUser.role" class="form-select" required>
                  <option value="admin">Quản trị viên</option>
                  <option value="landlord">Chủ nhà</option>
                  <option value="tenant">Người thuê</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  <i class="fas fa-times me-2"></i>Hủy
                </button>
                <button type="submit" class="btn btn-success" :disabled="isSubmitting">
                  <i class="fas fa-save me-2"></i>
                  {{ showEditUserModal ? "Cập nhật" : "Thêm" }}
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm ms-2"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import "@/styles/admin/user-management.css";
import axios from "axios";

const API_URL = "https://6725a513c39fedae05b5670b.mockapi.io/api/v1/users";

export default {
  name: "AdminUserManagement",
  data() {
    return {
      users: [],
      searchTerm: "",
      filteredUsers: [],
      currentPage: 1,
      pageSize: 10,
      showAddUserModal: false,
      showEditUserModal: false,
      emailError: "",
      passwordError: "",
      nameError: "",
      modalUser: {
        id: null,
        name: "",
        email: "",
        password: "",
        role: "tenant",
        status: "active",
      },
      sortKey: "",
      roleFilter: '', // Lọc theo vai trò
      statusFilter: '', // Lọc theo trạng thái
      sortAsc: true,
      isLoading: false,
      isSearching: false,
      isSubmitting: false,
      debounceTimeout: null,
      showPassword: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredUsers.slice(start, end);
    },
  },

  methods: {
    validateName() {
      if (!this.modalUser.name.trim()) {
        this.nameError = "Tên không được để trống";
        return false;
      }
      this.nameError = "";
      return true;
    },

    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.modalUser.email) {
        this.emailError = "Email không được để trống";
        return false;
      }
      if (!emailPattern.test(this.modalUser.email)) {
        this.emailError = "Email không đúng định dạng";
        return false;
      }
      this.emailError = "";
      return true;
    },

    validatePassword() {
      if (!this.showEditUserModal) {
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!this.modalUser.password) {
          this.passwordError = "Mật khẩu không được để trống";
          return false;
        }
        if (!passwordPattern.test(this.modalUser.password)) {
          this.passwordError = "Mật khẩu không đủ mạnh";
          return false;
        }
      }
      this.passwordError = "";
      return true;
    },

    validateForm() {
      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      return isNameValid && isEmailValid && isPasswordValid;
    },

    searchUsers() {
      clearTimeout(this.debounceTimeout);
      this.isSearching = true;

      this.debounceTimeout = setTimeout(() => {
        const searchTerm = this.searchTerm.toLowerCase();
        this.filteredUsers = this.users.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        this.currentPage = 1;
        this.paginateUsers();  // Sử dụng phân trang sau khi tìm kiếm
        this.isSearching = false;
      }, 300);
    },


    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await axios.get(API_URL);
        this.users = response.data;
        this.paginateUsers();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        this.isLoading = false;
      }
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      try {
        if (this.showEditUserModal) {
          await this.updateUser();
        } else {
          await this.addUser();
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    async addUser() {
      try {
        const existingUser = this.users.find(
          (user) =>
            user.email.toLowerCase() === this.modalUser.email.toLowerCase()
        );

        const encodedPassword = btoa(this.modalUser.password);

        const newUser = {
          ...this.modalUser,
          password: encodedPassword,
        };

        if (existingUser) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Email này đã tồn tại. Vui lòng sử dụng email khác.",
          });
          return;
        }

        const response = await axios.post(API_URL, newUser);
        this.users.push(response.data);
        this.paginateUsers();
        this.closeModal();

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Người dùng mới đã được thêm thành công!",
        });
      } catch (error) {
        console.error("Lỗi khi thêm người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể thêm người dùng. Vui lòng thử lại sau.",
        });
      }
    },

    async updateUser() {
      try {
        const response = await axios.put(
          `${API_URL}/${this.modalUser.id}`,
          this.modalUser
        );
        const index = this.users.findIndex(
          (user) => user.id === this.modalUser.id
        );

        if (index !== -1) {
          this.users.splice(index, 1, response.data);
          this.paginateUsers();
          this.closeModal();

          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Người dùng đã được cập nhật!",
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể cập nhật người dùng. Vui lòng thử lại sau.",
        });
      }
    },

    editUser(user) {
      this.modalUser = { ...user };
      this.showEditUserModal = true;
    },

    confirmDeleteUser(id) {
      Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa người dùng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(id);
        }
      });
    },

    async deleteUser(id) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        this.users = this.users.filter((user) => user.id !== id);
        this.paginateUsers();

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Người dùng đã được xóa thành công.",
        });
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể xóa người dùng. Vui lòng thử lại sau.",
        });
      }
    },

    async changeUserRole(id, role) {
      try {
        const user = this.users.find((user) => user.id === id);
        if (user) {
          await axios.put(`${API_URL}/${id}`, { role });
          user.role = role;
          this.paginateUsers();

          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Vai trò người dùng đã được cập nhật!",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Lỗi khi thay đổi vai trò người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể thay đổi vai trò người dùng. Vui lòng thử lại sau.",
        });
      }
    },

    async toggleUserStatus(id) {
      try {
        const user = this.users.find((user) => user.id === id);
        if (user) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          await axios.put(`${API_URL}/${id}`, { status: newStatus });
          user.status = newStatus;
          this.paginateUsers();

          Swal.fire({
            icon: newStatus === "active" ? "success" : "warning",
            title: newStatus === "active" ? "Đã kích hoạt" : "Đã vô hiệu hóa",
            text: `Người dùng đã được ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"
              }.`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể thay đổi trạng thái người dùng. Vui lòng thử lại sau.",
        });
      }
    },

    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }

      this.filteredUsers.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];

        if (valueA === null || valueA === undefined) valueA = "";
        if (valueB === null || valueB === undefined) valueB = "";

        if (valueA < valueB) return this.sortAsc ? -1 : 1;
        if (valueA > valueB) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },


    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    paginateUsers() {
      let users = [...this.users];

      if (this.searchTerm) {
        users = users.filter(
          (user) =>
            user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      if (this.roleFilter) {
        users = users.filter(user => user.role === this.roleFilter);
      }

      if (this.statusFilter) {
        users = users.filter(user => user.status === this.statusFilter);
      }

      this.filteredUsers = users;
      this.currentPage = 1;
    },

    resetFilters() {
      this.searchTerm = "";
      this.roleFilter = "";
      this.statusFilter = "";
      this.sortKey = "";
      this.sortAsc = true;
      this.currentPage = 1;
      this.paginateUsers();
    },


    closeModal() {
      this.showAddUserModal = false;
      this.showEditUserModal = false;
      this.modalUser = {
        id: null,
        name: "",
        email: "",
        password: "",
        role: "tenant",
        status: "active",
      };
      this.emailError = "";
      this.passwordError = "";
      this.nameError = "";
      this.showPassword = false;
    },
  },

  async created() {
    await this.fetchUsers();
  },
};
</script>

<style scoped>
.admin-user-management {
  position: relative;
  min-height: 110vh;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

th {
  cursor: pointer;
  user-select: none;
  position: relative;
}

th:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.btn-group {
  gap: 0.25rem;
}

.required::after {
  content: " *";
  color: red;
}

.table-responsive {
  min-height: 400px;
}

.form-label {
  font-weight: 500;
}

.invalid-feedback {
  display: block;
}

.btn .spinner-border {
  vertical-align: middle;
}

.password-input-group {
  position: relative;
}

.input-group .btn {
  height: 2.67em;
  position: relative;
  top: 21px;
  left: 0px;
  border: 2px solid black;
  z-index: 2;
}

.password-input-group .form-control {
  padding-right: 2.5rem;
}

.password-toggle-btn {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  font-size: 1.2rem;
  color: #6c757d;
}

.password-toggle-btn:focus {
  outline: none;
  box-shadow: none;
}

.password-toggle-btn:hover {
  color: #495057;
}

/* Thêm animation cho loading */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s;
}

.fade-leave-active {
  animation: fadeIn 0.3s reverse;
}
</style>
