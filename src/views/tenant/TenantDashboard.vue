<template>
  <div class="tenant-dashboard container mt-4">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="currentUser">
      <!-- Header with Welcome Message -->
      <div class="dashboard-header mb-4">
        <div class="row align-items-center">
          <div class="col-md-16">
            <h2>Xin chào, {{ currentUser.name }}!</h2>
            <p class="text-muted">{{ getCurrentDate() }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="stats-card">
            <div class="icon-wrapper bg-primary">
              <i class="fas fa-home"></i>
            </div>
            <div class="stats-info">
              <h6>Phòng của bạn</h6>
              <p>{{ roomInfo || 'Chưa có thông tin' }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stats-card">
            <div class="icon-wrapper bg-success">
              <i class="fas fa-money-bill"></i>
            </div>
            <div class="stats-info">
              <h6>Tiền phòng tháng này</h6>
              <p>{{ formatCurrency(currentMonthPayment) }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stats-card">
            <div class="icon-wrapper bg-warning">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stats-info">
              <h6>Hạn thanh toán</h6>
              <p>{{ paymentDueDate || 'Chưa có thông tin' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Notification -->
      <section class="dashboard-section">
        <div class="section-header">
          <h4>
            <i class="fas fa-bell me-2"></i>
            Thông báo mới nhất
          </h4>
          <router-link to="/tenant/notifications" class="btn btn-outline-primary btn-sm">
            Xem tất cả
          </router-link>
        </div>
        <div class="section-content">
          <div v-if="latestNotification" class="notification-card">
            <div class="notification-icon">
              <i class="fas fa-info-circle"></i>
            </div>
            <div class="notification-content">
              <h5>{{ latestNotification.title }}</h5>
              <p>{{ latestNotification.message }}</p>
              <small class="text-muted">{{ formatDate(latestNotification.date) }}</small>
            </div>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Hiện tại không có thông báo nào.
          </div>
        </div>
      </section>

      <!-- Recent Payments -->
      <section class="dashboard-section">
        <div class="section-header">
          <h4>
            <i class="fas fa-history me-2"></i>
            Lịch sử thanh toán gần đây
          </h4>
          <router-link to="/tenant/payment-history" class="btn btn-outline-primary btn-sm">
            Xem tất cả
          </router-link>
        </div>
        <div class="section-content">
          <div class="table-responsive" v-if="recentPayments.length > 0">
            <table class="table custom-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Tổng tiền</th>
                  <th>Đã trả</th>
                  <th>Còn lại</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in recentPayments" :key="payment.month">
                  <td>{{ formatMonth(payment.month) }}</td>
                  <td>{{ formatCurrency(payment.totalAmount) }}</td>
                  <td>{{ formatCurrency(payment.paidAmount) }}</td>
                  <td>{{ formatCurrency(payment.remainingAmount) }}</td>
                  <td>
                    <span :class="getPaymentStatusClass(payment.remainingAmount)">
                      {{ paymentStatus(payment.remainingAmount) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Chưa có lịch sử thanh toán nào.
          </div>
        </div>
      </section>

      <!-- Support Requests -->
      <section class="dashboard-section">
        <div class="section-header">
          <h4>
            <i class="fas fa-headset me-2"></i>
            Yêu cầu hỗ trợ gần đây
          </h4>
          <router-link to="/tenant/support" class="btn btn-outline-primary btn-sm">
            Xem tất cả
          </router-link>
        </div>
        <div class="section-content">
          <div class="table-responsive" v-if="recentSupportRequests.length > 0">
            <table class="table custom-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in recentSupportRequests" :key="request.id">
                  <td>{{ request.title }}</td>
                  <td>{{ formatDate(request.date) }}</td>
                  <td>
                    <span :class="getSupportStatusClass(request.resolved)">
                      {{ request.resolved ? 'Đã giải quyết' : 'Đang xử lý' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Chưa có yêu cầu hỗ trợ nào.
          </div>
        </div>
      </section>
    </div>

    <div v-else class="alert alert-warning">
      <i class="fas fa-exclamation-triangle me-2"></i>
      Vui lòng đăng nhập để xem thông tin.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser: null,
      latestNotification: null,
      recentPayments: [],
      recentSupportRequests: [],
      roomInfo: '',
      currentMonthPayment: 0,
      paymentDueDate: '',
      loading: true
    };
  },

  async created() {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        await this.initializeData();
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    async initializeData() {
      try {
        await Promise.all([
          this.loadNotifications(),
          this.loadPaymentHistory(),
          this.loadSupportRequests(),
          this.loadRoomInfo()
        ]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      }
    },

    getCurrentDate() {
      return new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    async loadRoomInfo() {
      if (!this.currentUser?.email) return;

      try {
        const response = await fetch('https://6725a513c39fedae05b5670b.mockapi.io/api/v1/rooms');
        const rooms = await response.json();
        
        const userRoom = rooms.find(room => 
          room.currentTenant === this.currentUser.name
        );

        if (userRoom) {
          this.roomInfo = `Phòng ${userRoom.roomNumber}`;
          this.currentMonthPayment = userRoom.price;
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(5);
          this.paymentDueDate = nextMonth.toLocaleDateString('vi-VN');
        }
      } catch (error) {
        console.error('Error loading room info:', error);
      }
    },

    async loadNotifications() {
      if (!this.currentUser?.email) return;
      
      try {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const userNotifications = notifications.filter(
          notif => notif.recipientEmail === this.currentUser.email
        );
        
        if (userNotifications.length > 0) {
          this.latestNotification = userNotifications[0];
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },

    async loadPaymentHistory() {
      if (!this.currentUser?.email) return;

      try {
        const response = await fetch('https://6725a513c39fedae05b5670b.mockapi.io/api/v1/bills');
        const bills = await response.json();
        
        this.recentPayments = bills
          .filter(bill => bill.customerEmail === this.currentUser.email)
          .sort((a, b) => new Date(b.month) - new Date(a.month))
          .slice(0, 5);
      } catch (error) {
        console.error('Error loading payment history:', error);
      }
    },

    loadSupportRequests() {
      if (!this.currentUser?.email) return;

      try {
        const allSupportRequests = JSON.parse(localStorage.getItem('supportRequests')) || [];
        this.recentSupportRequests = allSupportRequests
          .filter(request => request.senderEmail === this.currentUser.email)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      } catch (error) {
        console.error('Error loading support requests:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatMonth(monthStr) {
      const [year, month] = monthStr.split('-');
      return `Tháng ${month}/${year}`;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },

    paymentStatus(remainingAmount) {
      return remainingAmount > 0 ? 'Chưa thanh toán đủ' : 'Đã thanh toán đủ';
    },

    getPaymentStatusClass(remainingAmount) {
      return {
        'badge bg-success': remainingAmount === 0,
        'badge bg-warning': remainingAmount > 0
      };
    },

    getSupportStatusClass(resolved) {
      return {
        'badge bg-success': resolved,
        'badge bg-warning': !resolved
      };
    }
  }
};
</script>

<style scoped>
.tenant-dashboard {
  margin-top: 5em !important;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stats-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.icon-wrapper i {
  color: white;
  font-size: 1.5em;
}

.stats-info h6 {
  margin: 0;
  color: #6c757d;
  font-size: 0.9em;
}

.stats-info p {
  margin: 5px 0 0;
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
}

.dashboard-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h4 {
  margin: 0;
  font-size: 1.2em;
  color: #2c3e50;
}

.custom-table {
  margin: 0;
}

.custom-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.badge {
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.notification-card {
  display: flex;
  align-items: start;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.notification-icon {
  font-size: 1.5em;
  color: #007bff;
  margin-right: 15px;
}

.notification-content {
  flex: 1;
}

.notification-content h5 {
  margin: 0 0 10px;
  color: #2c3e50;
}

.alert {
  border-radius: 8px;
  padding: 15px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: start;
  }
  
  .section-header .btn {
    margin-top: 10px;
  }
  
  .table-responsive {
    margin: 0 -15px;
  }
}
</style>