<template>
  <div class="admin-user-management container">
    <h1 class="my-4">Quản Lý Người Dùng</h1>

    <!-- Form tìm kiếm người dùng -->
    <div class="input-group mb-4">
      <input
          type="text"
          v-model="searchTerm"
          @input="searchUsers"
          placeholder="Search users by email or name..."
          class="form-control"
      />
    </div>

    <!-- Nút thêm người dùng -->
    <div class="mb-3 d-flex justify-content-between">
      <button @click="showAddUserModal = true" class="btn btn-success">Add New User</button>
      <button @click="resetFilters" class="btn btn-secondary">Reset Filters</button>
    </div>

    <!-- Danh sách người dùng -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('email')">Email</th>
          <th>Role</th>
          <th @click="sortBy('status')">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name || 'N/A' }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="changeUserRole(user.id, user.role)" class="form-select">
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
            </select>
          </td>
          <td>{{ user.status }}</td>
          <td>
            <button @click="editUser(user)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
            <button @click="toggleUserStatus(user.id)" class="btn btn-sm" :class="user.status === 'active' ? 'btn-warning' : 'btn-success'">
              {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Previous</button>
        </li>
        <li class="page-item disabled"><span class="page-link">Page {{ currentPage }} of {{ totalPages }}</span></li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>

    <!-- Modal thêm/sửa người dùng -->
    <div v-if="showAddUserModal || showEditUserModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditUserModal ? 'Edit User' : 'Add New User' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditUserModal ? updateUser() : addUser()">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" v-model="modalUser.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="modalUser.email" class="form-control" required />
              </div>
              <div class="mb-3" v-if="!showEditUserModal">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="modalUser.password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select v-model="modalUser.role" class="form-select">
                  <option value="admin">Admin</option>
                  <option value="landlord">Landlord</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">{{ showEditUserModal ? 'Update User' : 'Add User' }}</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        alert('Email already exists. Please use a different email.');
        return;
      }
      const newUser = { ...this.modalUser, id: Date.now() };
      this.users.push(newUser);
      this.saveUsers();
      this.closeModal();
    },
    editUser(user) {
      this.modalUser = { ...user };
      this.showEditUserModal = true;
    },
    updateUser() {
      const index = this.users.findIndex((user) => user.id === this.modalUser.id);

      // Kiểm tra nếu email mới được chỉnh sửa đã tồn tại trong hệ thống mà không phải của người dùng hiện tại
      if (this.users.some(user => user.email.toLowerCase() === this.modalUser.email.toLowerCase() && user.id !== this.modalUser.id)) {
        alert('Email already exists. Please use a different email.');
        return;
      }

      if (index !== -1) {
        this.users.splice(index, 1, this.modalUser);
        this.saveUsers();
        this.closeModal();
      }
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
        alert(user.status === 'active' ? 'User is now active' : 'User has been deactivated');
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

<style scoped>
.admin-user-management {
  padding: 20px;
}

.table {
  margin-bottom: 20px;
}

.modal {
  z-index: 1050;
}

.btn{
  margin-right: 5px;
}

.modal-backdrop {
  z-index: 1040;
}

.pagination {
  margin-top: 20px;
}
</style>
