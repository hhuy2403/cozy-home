<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h1>Tổng quan hệ thống</h1>
      <div class="period-selector">
        <select v-model="selectedPeriod" class="form-select">
          <option value="today">Hôm nay</option>
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
        </select>
      </div>
    </div>

    <!-- Thống kê tổng quan -->
    <div class="stats-cards row mt-4">
      <div class="col-md-3">
        <div class="stats-card">
          <div class="stats-icon bg-primary">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-info">
            <h3>1,250</h3>
            <p>Tổng người dùng</p>
          </div>
          <div class="stats-footer">
            <span class="text-success">
              +5.2% so với kỳ trước
            </span>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stats-card">
          <div class="stats-icon bg-success">
            <i class="fas fa-home"></i>
          </div>
          <div class="stats-info">
            <h3>450</h3>
            <p>Tổng số phòng trọ</p>
          </div>
          <div class="stats-footer">
            <span class="text-success">
              +3.8% so với kỳ trước
            </span>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stats-card">
          <div class="stats-icon bg-warning">
            <i class="fas fa-file-contract"></i>
          </div>
          <div class="stats-info">
            <h3>380</h3>
            <p>Hợp đồng đang có hiệu lực</p>
          </div>
          <div class="stats-footer">
            <span class="text-danger">
              -1.2% so với kỳ trước
            </span>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stats-card">
          <div class="stats-icon bg-info">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stats-info">
            <h3>125,000,000đ</h3>
            <p>Doanh thu</p>
          </div>
          <div class="stats-footer">
            <span class="text-success">
              +8.5% so với kỳ trước
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="charts-section row mt-4">
      <div class="col-md-8">
        <div class="chart-card">
          <h4>Thống kê doanh thu</h4>
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
      <div class="col-md-4">
        <div class="chart-card">
          <h4>Phân bố người dùng</h4>
          <canvas ref="userDistributionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Hoạt động gần đây -->
    <div class="recent-activities mt-4">
      <h4>Hoạt động gần đây</h4>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hoạt động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15/03/2024 08:30</td>
              <td>Nguyễn Văn A</td>
              <td>Đăng ký mới</td>
              <td>Đăng ký tài khoản chủ trọ</td>
            </tr>
            <tr>
              <td>15/03/2024 09:15</td>
              <td>Trần Thị B</td>
              <td>Đăng tin mới</td>
              <td>Đăng tin cho thuê: Phòng trọ Quận 1</td>
            </tr>
            <tr>
              <td>15/03/2024 10:00</td>
              <td>Lê Văn C</td>
              <td>Tạo hợp đồng</td>
              <td>Hợp đồng thuê phòng: Phòng 101</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  
  data() {
    return {
      selectedPeriod: 'week'
    }
  },

  mounted() {
    this.initCharts()
  },

  methods: {
    initCharts() {
      // Biểu đồ doanh thu
      const revenueCtx = this.$refs.revenueChart.getContext('2d')
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
          datasets: [{
            label: 'Doanh thu (triệu đồng)',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      })

      // Biểu đồ phân bố người dùng
      const userDistCtx = this.$refs.userDistributionChart.getContext('2d')
      new Chart(userDistCtx, {
        type: 'doughnut',
        data: {
          labels: ['Chủ trọ', 'Người thuê', 'Admin'],
          datasets: [{
            data: [300, 900, 50],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ]
          }]
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  margin-top: 70px;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.period-selector {
  width: 200px;
}

.stats-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.stats-icon i {
  color: white;
  font-size: 1.5rem;
}

.stats-info h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.stats-info p {
  margin: 5px 0;
  color: #666;
}

.stats-footer {
  margin-top: 10px;
  font-size: 0.9rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.chart-card h4 {
  margin-bottom: 20px;
}

.recent-activities {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.text-success {
  color: #198754;
}

.text-danger {
  color: #dc3545;
}

.bg-primary {
  background-color: #0d6efd;
}

.bg-success {
  background-color: #198754;
}

.bg-warning {
  background-color: #ffc107;
}

.bg-info {
  background-color: #0dcaf0;
}
</style>