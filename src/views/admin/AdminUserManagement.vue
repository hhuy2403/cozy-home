<template>
  <div class="admin-user-management container">
    <h1 class="my-4">Quản Lý Người Dùng</h1>

    <!-- Form tìm kiếm người dùng -->
    <div class="input-group mb-4">
      <input
          type="text"
          v-model="searchTerm"
          @input="searchUsers"
          placeholder="Tìm kiếm người dùng qua email hoặc tên..."
          class="form-control"
      />
    </div>

    <!-- Nút thêm người dùng -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <button @click="showAddUserModal = true" class="btn btn-success">Thêm người dùng mới</button>
      <button @click="resetFilters" class="btn btn-secondary">Đặt lại bộ lọc</button>
    </div>

    <!-- Danh sách người dùng -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-dark">
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('name')">Tên</th>
          <th @click="sortBy('email')">Email</th>
          <th>Vai trò</th>
          <th @click="sortBy('status')">Trạng thái</th>
          <th>Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name || 'N/A' }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="changeUserRole(user.id, user.role)" class="form-select">
              <option value="admin">Quản trị viên</option>
              <option value="landlord">Chủ nhà</option>
              <option value="tenant">Người thuê</option>
            </select>
          </td>
          <td>{{ user.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa' }}</td>
          <td>
            <button @click="editUser(user)" class="btn btn-primary btn-sm">Sửa</button>
            <button @click="confirmDeleteUser(user.id)" class="btn btn-danger btn-sm">Xóa</button>
            <button @click="toggleUserStatus(user.id)" class="btn btn-sm" :class="user.status === 'active' ? 'btn-warning' : 'btn-success'">
              {{ user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Phân trang">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Trang trước</button>
        </li>
        <li class="page-item disabled"><span class="page-link">Trang {{ currentPage }} trên {{ totalPages }}</span></li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Trang tiếp theo</button>
        </li>
      </ul>
    </nav>

    <!-- Modal thêm/sửa người dùng -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditUserModal ? 'Sửa người dùng' : 'Thêm người dùng mới' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditUserModal ? updateUser() : addUser()">
              <div class="mb-3">
                <label for="name" class="form-label">Tên</label>
                <input type="text" v-model="modalUser.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="modalUser.email" class="form-control" required />
              </div>
              <div class="mb-3" v-if="!showEditUserModal">
                <label for="password" class="form-label">Mật khẩu</label>
                <input type="password" v-model="modalUser.password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Vai trò</label>
                <select v-model="modalUser.role" class="form-select">
                  <option value="admin">Quản trị viên</option>
                  <option value="landlord">Chủ nhà</option>
                  <option value="tenant">Người thuê</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">{{ showEditUserModal ? 'Cập nhật' : 'Thêm' }}</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import "@/styles/admin/user-management.css"

export default {
  name: 'AdminUserManagement',
  data() {
    return {
      users: JSON.parse(localStorage.getItem('users')) || [],
      searchTerm: '',
      filteredUsers: [],
      currentPage: 1,
      pageSize: 5,
      showAddUserModal: false,
      showEditUserModal: false,
      modalUser: {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'tenant',
        status: 'active',
      },
      sortKey: '',
      sortAsc: true,
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
    isEmailDuplicate(email) {
      return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    },
    searchUsers() {
      this.filteredUsers = this.users.filter(
          (user) =>
              user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    addUser() {
      if (this.isEmailDuplicate(this.modalUser.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Email này đã tồn tại. Vui lòng sử dụng email khác.',
        });
        return;
      }
      const newUser = { ...this.modalUser, id: Date.now() };
      this.users.push(newUser);
      this.saveUsers();
      this.closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Người dùng mới đã được thêm thành công!',
      });
    },
    editUser(user) {
      this.modalUser = { ...user };
      this.showEditUserModal = true;
    },
    updateUser() {
      const index = this.users.findIndex((user) => user.id === this.modalUser.id);

      // Kiểm tra nếu email mới được chỉnh sửa đã tồn tại trong hệ thống mà không phải của người dùng hiện tại
      if (this.users.some(user => user.email.toLowerCase() === this.modalUser.email.toLowerCase() && user.id !== this.modalUser.id)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Email này đã tồn tại. Vui lòng sử dụng email khác.',
        });
        return;
      }

      if (index !== -1) {
        this.users.splice(index, 1, this.modalUser);
        this.saveUsers();
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Người dùng đã được cập nhật!',
        });
      }
    },
    confirmDeleteUser(id) {
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Người dùng này sẽ bị xóa!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(id);
          Swal.fire(
              'Đã xóa!',
              'Người dùng đã bị xóa thành công.',
              'success'
          );
        }
      });
    },
    deleteUser(id) {
      this.users = this.users.filter((user) => user.id !== id);
      this.saveUsers();
    },
    changeUserRole(id, role) {
      const user = this.users.find((user) => user.id === id);
      if (user) {
        user.role = role;
        this.saveUsers();
      }
    },
    toggleUserStatus(id) {
      const user = this.users.find((user) => user.id === id);
      if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        this.saveUsers();
        Swal.fire({
          icon: user.status === 'active' ? 'success' : 'warning',
          title: user.status === 'active' ? 'Đã kích hoạt' : 'Đã vô hiệu hóa',
          text: `Người dùng đã được ${user.status === 'active' ? 'kích hoạt' : 'vô hiệu hóa'}.`,
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
        if (a[key] < b[key]) return this.sortAsc ? -1 : 1;
        if (a[key] > b[key]) return this.sortAsc ? 1 : -1;
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
    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users));
      this.paginateUsers();
    },
    paginateUsers() {
      this.filteredUsers = this.users.slice();
    },
    resetFilters() {
      this.searchTerm = '';
      this.paginateUsers();
    },
    closeModal() {
      this.showAddUserModal = false;
      this.showEditUserModal = false;
      this.modalUser = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'tenant',
        status: 'active',
      };
    },
  },
  created() {
    this.paginateUsers();
  },
};
</script>
