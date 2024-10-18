<template>
  <div class="admin-financial-management container">
    <h1 class="my-4">Quản Lý Tài Chính</h1>

    <!-- Tabs cho các chức năng chính -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#payments" role="tab">Quản lý Thanh Toán</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#invoices" role="tab">Quản lý Hóa Đơn</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#history" role="tab">Lịch Sử Thanh Toán</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#reports" role="tab">Báo Cáo Tài Chính</a>
      </li>
    </ul>

    <!-- Nội dung của các tab -->
    <div class="tab-content">
      <!-- Quản lý Thanh Toán -->
      <div class="tab-pane fade show active" id="payments" role="tabpanel">
        <h2>Quản lý Thanh Toán của Landlord</h2>
        <div class="mb-3 d-flex justify-content-between">
          <button class="btn btn-success" @click="processPayment('online')">Xử lý Thanh Toán Online</button>
          <button class="btn btn-secondary" @click="processPayment('offline')">Xử lý Thanh Toán Offline</button>
        </div>
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên Landlord</th>
            <th>Gói Đăng Ký</th>
            <th>Chi Phí</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{ payment.id }}</td>
            <td>{{ payment.landlord }}</td>
            <td>{{ payment.subscription }}</td>
            <td>{{ formatCurrency(payment.amount) }}</td>
            <td>{{ payment.status }}</td>
            <td>
              <button v-if="payment.status === 'Pending'" class="btn btn-warning" @click="markAsPaid(payment.id)">
                Đánh dấu Đã Thanh Toán
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Quản lý Hóa Đơn -->
      <div class="tab-pane fade" id="invoices" role="tabpanel">
        <h2>Quản lý Hóa Đơn & Khoản Nợ của Landlord</h2>
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên Landlord</th>
            <th>Hóa Đơn</th>
            <th>Khoản Nợ</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>{{ invoice.id }}</td>
            <td>{{ invoice.landlord }}</td>
            <td>{{ formatCurrency(invoice.amount) }}</td>
            <td>{{ formatCurrency(invoice.debt) }}</td>
            <td>{{ invoice.status }}</td>
            <td>
              <button v-if="invoice.status === 'Unpaid'" class="btn btn-danger" @click="sendReminder(invoice.id)">
                Nhắc Nhở Thanh Toán
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Lịch Sử Thanh Toán -->
      <div class="tab-pane fade" id="history" role="tabpanel">
        <h2>Theo dõi Lịch Sử Thanh Toán</h2>
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Người Dùng</th>
            <th>Vai Trò</th>
            <th>Số Tiền</th>
            <th>Ngày Thanh Toán</th>
            <th>Phương Thức</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="history in paymentHistory" :key="history.id">
            <td>{{ history.id }}</td>
            <td>{{ history.user }}</td>
            <td>{{ history.role }}</td>
            <td>{{ formatCurrency(history.amount) }}</td>
            <td>{{ history.date }}</td>
            <td>{{ history.method }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Báo Cáo Tài Chính -->
      <div class="tab-pane fade" id="reports" role="tabpanel">
        <h2>Tạo Báo Cáo Tài Chính</h2>
        <div class="mb-3">
          <label for="reportType" class="form-label">Loại Báo Cáo</label>
          <select v-model="selectedReport" class="form-select" id="reportType">
            <option value="monthly">Báo cáo theo Tháng</option>
            <option value="quarterly">Báo cáo theo Quý</option>
            <option value="yearly">Báo cáo theo Năm</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="generateReport">Tạo Báo Cáo</button>

        <!-- Hiển thị báo cáo -->
        <div v-if="reportGenerated" class="mt-4">
          <h3>Báo Cáo {{ reportPeriod }}</h3>
          <p>Doanh Thu: {{ formatCurrency(reportRevenue) }}</p>
          <!-- Thêm thông tin chi tiết báo cáo tài chính tại đây -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminFinancialManagement',
  data() {
    return {
      payments: [
        // Dữ liệu giả lập thanh toán
        { id: 1, landlord: 'Nguyen Van A', subscription: 'Cơ Bản', amount: 500000, status: 'Pending' },
        { id: 2, landlord: 'Tran Van B', subscription: 'Nâng Cao', amount: 1000000, status: 'Paid' }
      ],
      invoices: [
        // Dữ liệu giả lập hóa đơn
        { id: 1, landlord: 'Nguyen Van A', amount: 500000, debt: 0, status: 'Paid' },
        { id: 2, landlord: 'Tran Van B', amount: 1000000, debt: 100000, status: 'Unpaid' }
      ],
      paymentHistory: [
        // Dữ liệu giả lập lịch sử thanh toán
        { id: 1, user: 'Nguyen Van A', role: 'Landlord', amount: 500000, date: '2024-10-01', method: 'Online' },
        { id: 2, user: 'Tran Van B', role: 'Landlord', amount: 1000000, date: '2024-09-15', method: 'Offline' }
      ],
      selectedReport: 'monthly',
      reportGenerated: false,
      reportPeriod: '',
      reportRevenue: 0
    };
  },
  methods: {
    processPayment(method) {
      alert(`Xử lý thanh toán ${method === 'online' ? 'online' : 'offline'}.`);
    },
    markAsPaid(paymentId) {
      const payment = this.payments.find(p => p.id === paymentId);
      if (payment) {
        payment.status = 'Paid';
        alert('Thanh toán đã được đánh dấu là "Paid".');
      }
    },
    sendReminder(invoiceId) {
      alert(`Nhắc nhở thanh toán cho hóa đơn ID: ${invoiceId}`);
    },
    generateReport() {
      this.reportGenerated = true;
      this.reportPeriod = this.selectedReport === 'monthly' ? 'Tháng' :
          this.selectedReport === 'quarterly' ? 'Quý' : 'Năm';
      this.reportRevenue = 15000000; // Ví dụ dữ liệu doanh thu
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
  }
};
</script>

<style scoped>
.admin-financial-management {
  padding: 20px;
}

.table {
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
