<template>
  <div class="analytics-reporting container">
    <h1 class="my-4 text-center">Báo Cáo Phân Tích và Thống Kê</h1>

    <div class="row">
      <!-- Thống Kê Số Phòng -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card shadow-sm border-primary">
          <div class="card-body">
            <h5 class="card-title text-primary">Thống Kê Số Phòng</h5>
            <p class="card-text">Tổng số phòng trọ: <strong>{{ totalRooms }}</strong></p>
            <p class="card-text">Số phòng còn trống: <strong>{{ availableRooms }}</strong></p>
          </div>
        </div>
      </div>

      <!-- Báo Cáo Doanh Thu -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card shadow-sm border-success">
          <div class="card-body">
            <h5 class="card-title text-success">Báo Cáo Doanh Thu</h5>
            <p class="card-text">Tổng doanh thu từ việc cho thuê: <strong>{{ formatCurrency(totalRevenue) }}</strong></p>
          </div>
        </div>
      </div>

      <!-- Thống Kê Hợp Đồng -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card shadow-sm border-info">
          <div class="card-body">
            <h5 class="card-title text-info">Thống Kê Hợp Đồng</h5>
            <p class="card-text">Số lượng hợp đồng theo thời gian: <strong>{{ totalContracts }}</strong> hợp đồng</p>
          </div>
        </div>
      </div>

      <!-- Báo Cáo Khiếu Nại và Phản Hồi -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card shadow-sm border-warning">
          <div class="card-body">
            <h5 class="card-title text-warning">Báo Cáo Khiếu Nại và Phản Hồi</h5>
            <p class="card-text">Số lượng khiếu nại đã xử lý: <strong>{{ resolvedComplaints }}</strong></p>
            <p class="card-text">Số lượng phản hồi đã xử lý: <strong>{{ resolvedFeedbacks }}</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/admin/report-management.css"
export default {
  name: 'AnalyticsReporting',
  data() {
    return {
      rooms: [
        { id: 1, name: 'Phòng 101', status: 'rented' },
        { id: 2, name: 'Phòng 102', status: 'available' },
        { id: 3, name: 'Phòng 103', status: 'rented' },
      ],
      leases: [
        { id: 1, revenue: 5000000 },
        { id: 2, revenue: 4500000 },
      ],
      complaints: [
        { id: 1, resolved: true },
        { id: 2, resolved: false },
        { id: 3, resolved: true },
      ],
      feedbacks: [
        { id: 1, resolved: true },
        { id: 2, resolved: true },
        { id: 3, resolved: false },
      ],
    };
  },
  computed: {
    totalRooms() {
      return this.rooms.length;
    },
    availableRooms() {
      return this.rooms.filter(room => room.status === 'available').length;
    },
    totalRevenue() {
      return this.leases.reduce((total, lease) => total + lease.revenue, 0);
    },
    totalContracts() {
      return this.leases.length;
    },
    resolvedComplaints() {
      return this.complaints.filter(complaint => complaint.resolved).length;
    },
    resolvedFeedbacks() {
      return this.feedbacks.filter(feedback => feedback.resolved).length;
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
  },
};
</script>
