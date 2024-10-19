<template>
  <div class="admin-financial-management container">
    <h1 class="my-4">Quản Lý Tài Chính</h1>

    <!-- Tabs for different sections -->
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

    <!-- Tab content -->
    <div class="tab-content">
      <!-- Payment Management -->
      <div class="tab-pane fade show active" id="payments" role="tabpanel">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button class="btn btn-success" @click="processPayment('online')">Xử lý Thanh Toán Online</button>
          <button class="btn btn-secondary" @click="processPayment('offline')">Xử lý Thanh Toán Offline</button>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover">
            <thead class="table-dark">
            <tr>
              <th @click="sortBy('id')">ID</th>
              <th @click="sortBy('landlord')">Tên Landlord</th>
              <th @click="sortBy('subscription')">Gói Đăng Ký</th>
              <th @click="sortBy('amount')">Chi Phí</th>
              <th @click="sortBy('status')">Trạng Thái</th>
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
                <button v-if="payment.status === 'Pending'" class="btn btn-warning btn-sm" @click="markAsPaid(payment.id)">
                  Đánh dấu Đã Thanh Toán
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Invoice Management -->
      <div class="tab-pane fade" id="invoices" role="tabpanel">
        <h2>Quản lý Hóa Đơn & Khoản Nợ của Landlord</h2>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover">
            <thead class="table-dark">
            <tr>
              <th @click="sortBy('id')">ID</th>
              <th @click="sortBy('landlord')">Tên Landlord</th>
              <th @click="sortBy('amount')">Hóa Đơn</th>
              <th @click="sortBy('debt')">Khoản Nợ</th>
              <th @click="sortBy('status')">Trạng Thái</th>
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
                <button v-if="invoice.status === 'Unpaid'" class="btn btn-danger btn-sm" @click="sendReminder(invoice.id)">
                  Nhắc Nhở Thanh Toán
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment History -->
      <div class="tab-pane fade" id="history" role="tabpanel">
        <h2>Theo dõi Lịch Sử Thanh Toán</h2>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover">
            <thead class="table-dark">
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
      </div>

      <!-- Financial Reports -->
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

        <!-- Display the report -->
        <div v-if="reportGenerated" class="mt-4">
          <h3>Báo Cáo {{ reportPeriod }}</h3>
          <p>Doanh Thu: {{ formatCurrency(reportRevenue) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import "@/styles/admin/financial-management.css"

export default {
  name: 'AdminFinancialManagement',
  data() {
    return {
      payments: [
        { id: 1, landlord: 'Nguyen Van A', subscription: 'Cơ Bản', amount: 500000, status: 'Pending' },
        { id: 2, landlord: 'Tran Van B', subscription: 'Nâng Cao', amount: 1000000, status: 'Paid' }
      ],
      invoices: [
        { id: 1, landlord: 'Nguyen Van A', amount: 500000, debt: 0, status: 'Paid' },
        { id: 2, landlord: 'Tran Van B', amount: 1000000, debt: 100000, status: 'Unpaid' }
      ],
      paymentHistory: [
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
      Swal.fire({
        icon: 'info',
        title: 'Xử lý thanh toán',
        text: `Xử lý thanh toán ${method === 'online' ? 'online' : 'offline'}.`,
      });
    },
    markAsPaid(paymentId) {
      const payment = this.payments.find(p => p.id === paymentId);
      if (payment) {
        payment.status = 'Paid';
        Swal.fire({
          icon: 'success',
          title: 'Đã Thanh Toán',
          text: 'Thanh toán đã được đánh dấu là "Paid".',
        });
      }
    },
    sendReminder(invoiceId) {
      Swal.fire({
        icon: 'warning',
        title: 'Nhắc nhở thanh toán',
        text: `Nhắc nhở thanh toán cho hóa đơn ID: ${invoiceId}.`,
      });
    },
    generateReport() {
      this.reportGenerated = true;
      this.reportPeriod = this.selectedReport === 'monthly' ? 'Tháng' :
          this.selectedReport === 'quarterly' ? 'Quý' : 'Năm';
      this.reportRevenue = 15000000;

      Swal.fire({
        icon: 'success',
        title: 'Báo Cáo Đã Tạo',
        text: `Báo cáo tài chính theo ${this.reportPeriod} đã được tạo.`,
      });
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
  }
};
</script>
