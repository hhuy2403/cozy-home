<template>
  <div class="analytics-reporting container">
    <h1 class="my-4">Báo Cáo Phân Tích và Thống Kê</h1>

    <div class="mb-4">
      <h3>Thống Kê Số Phòng</h3>
      <p>Tổng số phòng trọ: {{ totalRooms }}</p>
      <p>Số phòng còn trống: {{ availableRooms }}</p>
    </div>

    <div class="mb-4">
      <h3>Báo Cáo Doanh Thu</h3>
      <p>Tổng doanh thu từ việc cho thuê: {{ formatCurrency(totalRevenue) }}</p>
    </div>

    <div class="mb-4">
      <h3>Thống Kê Hợp Đồng</h3>
      <p>Số lượng hợp đồng theo thời gian: {{ totalContracts }} hợp đồng</p>
    </div>

    <div class="mb-4">
      <h3>Báo Cáo Khiếu Nại và Phản Hồi</h3>
      <p>Số lượng khiếu nại đã xử lý: {{ resolvedComplaints }}</p>
      <p>Số lượng phản hồi đã xử lý: {{ resolvedFeedbacks }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsReporting',
  data() {
    return {
      rooms: [
        { id: 1, name: 'Phòng 101', status: 'rented' },
        { id: 2, name: 'Phòng 102', status: 'available' },
        { id: 3, name: 'Phòng 103', status: 'rented' },
        // Thêm các phòng khác nếu cần
      ],
      leases: [
        { id: 1, revenue: 5000000 },
        { id: 2, revenue: 4500000 },
        // Thêm các hợp đồng cho thuê khác nếu cần
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

<style scoped>
.analytics-reporting {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}
</style>
