<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <button class="toggle-sidebar" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </button>
    <div class="header" v-if="!isCollapsed">
      <h2>QUẢN LÝ NHÀ TRỌ</h2>
      <h3>CozyHome</h3>
      <p>XIN CHÀO, {{ userName }}</p> <!-- Hiển thị tên người dùng -->
    </div>

    <ul class="nav-list">
      <li v-for="item in menuItems" :key="item.route">
        <router-link :to="item.route" active-class="active">
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
      </li>
      <li class="nav-item">
        <a @click="handleLogout" class="nav-link">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </a>
      </li>
    </ul>

    <div class="bottom-icons">
      <router-link to="/landlord/change-password">
        <i class="fas fa-key"></i>
      </router-link>
      <button @click="toggleFullScreen">
        <i class="fas fa-expand"></i>
      </button>
      <button @click="toggleVisibility">
        <i :class="isVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </button>
      <!-- Nút đăng xuất -->
      <button @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </aside>
</template>


<script>
import Swal from 'sweetalert2';
import "@/styles/landlord/sidebar.css"

export default {
  name: 'LandlordSidebar',
  data() {
    return {
      isCollapsed: false,
      userName: '',  // Biến lưu trữ tên người dùng đã đăng nhập
      isVisible: true,  // Biến để điều khiển hiển thị
      menuItems: [
        { label: 'Trang chủ', route: '/landlord/dashboard', icon: 'fas fa-home' },
        { label: 'Phòng', route: '/landlord/room-index', icon: 'fas fa-door-open' },
        { label: 'Dịch vụ', route: '/landlord/service-index', icon: 'fas fa-concierge-bell' },
        { label: 'Chỉ số điện', route: '/landlord/data-power', icon: 'fas fa-bolt' },
        { label: 'Chỉ số nước', route: '/landlord/data-water', icon: 'fas fa-tint' },
        { label: 'Phát sinh', route: '/landlord/other-fee', icon: 'fas fa-file-invoice-dollar' },
        { label: 'Tính tiền', route: '/landlord/tenant-fee', icon: 'fas fa-money-check-alt' },
        { label: 'Lịch sử gửi email/SMS', route: '/landlord/email-sms-history', icon: 'fas fa-envelope' },
        { label: 'Báo cáo', route: '/landlord/report', icon: 'fas fa-chart-line' },
        { label: 'Thiết lập', route: '/landlord/settings', icon: 'fas fa-cogs' },
        { label: 'Tài sản', route: '/landlord/assets', icon: 'fas fa-box' },
        { label: 'Hợp đồng', route: '/landlord/contracts', icon: 'fas fa-file-contract' },
        { label: 'Cọc giữ phòng', route: '/landlord/room-guard', icon: 'fas fa-shield-alt' },
        { label: 'Đổi mật khẩu', route: '/landlord/change-password', icon: 'fas fa-key' },
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },

    getUserName() {
      const users = JSON.parse(localStorage.getItem('users'));  // Lấy danh sách người dùng từ localStorage
      const userRole = localStorage.getItem('userRole');  // Lấy vai trò người dùng từ localStorage

      if (users && userRole) {
        const currentUser = users.find(user => user.role === userRole && user.role === 'landlord');
        if (currentUser) {
          this.userName = currentUser.name;  // Gán tên người dùng vào userName
        } else {
          this.userName = 'Người dùng';  // Nếu không tìm thấy người dùng
        }
      } else {
        this.userName = 'Người dùng';  // Trường hợp không có dữ liệu trong localStorage
      }
    },

    handleLogout() {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn đăng xuất?',
        text: "Bạn sẽ cần đăng nhập lại sau khi đăng xuất!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          // Nếu người dùng xác nhận đăng xuất, xóa dữ liệu đăng nhập và điều hướng về trang đăng nhập
          localStorage.removeItem('loggedInUser');
          localStorage.removeItem('userRole');
          this.$router.push('/login');

          Swal.fire(
              'Đã đăng xuất!',
              'Bạn đã đăng xuất thành công.',
              'success'
          )
        }
      });
    },

    toggleFullScreen() {
      const doc = document;
      const docEl = doc.documentElement;

      const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      } else {
        cancelFullScreen.call(doc);
      }
    },

    toggleVisibility() {
      this.isVisible = !this.isVisible;
    }
  },
  mounted() {
    this.getUserName();  // Lấy tên người dùng khi component được mount
  }
};
</script>
