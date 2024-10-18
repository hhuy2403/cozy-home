<template>
  <header class="header navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link class="navbar-brand" to="/"><i class="fas fa-home-alt"></i> CozyHome</router-link>

      <!-- Toggler for mobile view -->
      <button
          class="navbar-toggler"
          type="button"
          @click="toggleNavbar"
      >
        <span class="navbar-toggler-icon"><i class="fas fa-bars"></i></span>
      </button>

      <!-- Navigation Links -->
      <div :class="['collapse', 'navbar-collapse', { 'show': isNavbarOpen }]" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Menu cho Admin -->
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/dashboard">Trang Chủ</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/contracts">Hợp Đồng</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/reports">Báo cáo</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/users">Người Dùng</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/financial">Tài Chính</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/room-property">Phòng & Tài Sản</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/maintenance-service">BT & DV</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/feedback">Feedback</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/notification">Notification</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'admin'">
            <router-link class="nav-link" to="/admin/settings">Cài Đặt</router-link>
          </li>

          <!-- Menu cho Tenant -->
          <li class="nav-item" v-if="userRole === 'tenant'">
            <router-link class="nav-link" to="/tenant/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'tenant'">
            <router-link class="nav-link" to="/tenant/contracts">My Contracts</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'tenant'">
            <router-link class="nav-link" to="/tenant/payment-history">Payment History</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'tenant'">
            <router-link class="nav-link" to="/tenant/payments">Payments</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'tenant'">
            <router-link class="nav-link" to="/tenant/profile">Profile</router-link>
          </li>

          <!-- Menu cho Guest -->
          <li class="nav-item" v-if="userRole === 'guest'">
            <router-link class="nav-link" to="/login"><i class="fas fa-sign-in"></i> Đăng Nhập</router-link>
          </li>
          <li class="nav-item" v-if="userRole === 'guest'">
            <router-link class="nav-link" to="/register"><i class="fas fa-user-plus"></i> Đăng Ký</router-link>
          </li>

          <!-- Logout Button -->
          <li class="nav-item" v-if="userRole !== 'guest'">
            <button class="btn btn-outline-light" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      userRole: '', // Lưu vai trò người dùng từ localStorage hoặc xác thực API
      isNavbarOpen: false // Biến để quản lý trạng thái toggle
    };
  },
  created() {
    // Lấy vai trò người dùng từ localStorage hoặc mặc định là 'guest'
    this.userRole = localStorage.getItem('userRole') || 'guest';
  },
  methods: {
    toggleNavbar() {
      // Chuyển đổi trạng thái navbar mở/đóng
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    logout() {
      // Xóa vai trò người dùng và thông tin đăng nhập khỏi localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');

      // Điều hướng về trang đăng nhập
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Custom styles for Navbar */
.navbar {
  background-color: #2a3f54; /* Màu nền chính */
  padding: 15px 20px;
}

.navbar-brand {
  display: flex;
  align-items: flex-start;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
}

.navbar-brand:hover {
  color: #ff9800;
}

.nav-link {
  color: #ffffff;
  font-size: 1.1rem;
  margin-right: 15px;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ff9800;
}

.navbar-toggler {
  border-color: #ffffff;
}

.navbar-toggler-icon {
  background-image: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Styles to handle the collapse and show behavior */
.collapse {
  display: none;
}

.collapse.show {
  display: block;
}

.btn-outline-light {
  color: #ffffff;
  border-color: #ffffff;
}

.btn-outline-light:hover {
  background-color: #ffffff;
  color: #2a3f54;
}
</style>
