<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <button class="toggle-sidebar" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </button>
    <div class="header" v-if="!isCollapsed">
      <h2>QUẢN LÝ NHÀ TRỌ</h2>
      <h3>CozyHome</h3>
      <p>XIN CHÀO, HOÀNG VĂN HUY</p>
    </div>



    <ul class="nav-list">
      <li v-for="item in menuItems" :key="item.route">
        <router-link :to="item.route" active-class="active">
          <i :class="item.icon"></i>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </router-link>
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
      <router-link to="/landlord/logout">
        <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </div>
  </aside>
</template>

<script>
import "@/styles/landlord/sidebar.css"
export default {
  name: 'LandlordSidebar',
  data() {
    return {
      isCollapsed: false,
      menuItems: [
        { label: 'Trang chủ', route: '/landlord/dashboard', icon: 'fas fa-home' },
        { label: 'Phòng', route: '/landlord/room-index', icon: 'fas fa-door-open' },
        { label: 'Dịch vụ', route: '/landlord/service-management', icon: 'fas fa-concierge-bell' },
        { label: 'Chỉ số điện', route: '/landlord/electricity-meter', icon: 'fas fa-bolt' },
        { label: 'Chỉ số nước', route: '/landlord/water-meter', icon: 'fas fa-tint' },
        { label: 'Phát sinh', route: '/landlord/generate-invoice', icon: 'fas fa-file-invoice-dollar' },
        { label: 'Tính tiền', route: '/landlord/tenant-fee', icon: 'fas fa-money-check-alt' },
        { label: 'Lịch sử gửi email/SMS', route: '/landlord/email-sms-history', icon: 'fas fa-envelope' },
        { label: 'Báo cáo', route: '/landlord/report', icon: 'fas fa-chart-line' },
        { label: 'Thiết lập', route: '/landlord/settings', icon: 'fas fa-cogs' },
        { label: 'Tài sản', route: '/landlord/assets', icon: 'fas fa-box' },
        { label: 'Hợp đồng', route: '/landlord/contracts', icon: 'fas fa-file-contract' },
        { label: 'Cọc giữ phòng', route: '/landlord/room-guard', icon: 'fas fa-shield-alt' },
        { label: 'Đổi mật khẩu', route: '/landlord/change-password', icon: 'fas fa-key' },
        { label: 'Đăng xuất', route: '/landlord/logout', icon: 'fas fa-sign-out-alt' }
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
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
  }
};
</script>


