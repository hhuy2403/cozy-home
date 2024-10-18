<template>
  <div class="admin-maintenance-service-management container">
    <h1 class="my-4">Quản Lý Bảo Trì và Dịch Vụ Hệ Thống</h1>

    <!-- Tabs cho các chức năng chính -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#requests" role="tab">Quản lý Yêu Cầu Bảo Trì</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#reports" role="tab">Báo Cáo Dịch Vụ</a>
      </li>
    </ul>

    <!-- Nội dung của các tab -->
    <div class="tab-content">
      <!-- Quản lý Yêu Cầu Bảo Trì -->
      <div class="tab-pane fade show active" id="requests" role="tabpanel">
        <h2>Quản lý Yêu Cầu Bảo Trì từ Tenants hoặc Landlords</h2>
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Người Yêu Cầu</th>
            <th>Vai Trò</th>
            <th>Mô Tả Yêu Cầu</th>
            <th>Trạng Thái</th>
            <th>Ngày Yêu Cầu</th>
            <th>Nhân Viên Xử Lý</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="request in maintenanceRequests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.requester }}</td>
            <td>{{ request.role }}</td>
            <td>{{ request.description }}</td>
            <td>{{ request.status }}</td>
            <td>{{ request.requestDate }}</td>
            <td>{{ request.assignedStaff || 'Chưa phân công' }}</td>
            <td>
              <button v-if="request.status === 'Pending'" class="btn btn-success btn-sm" @click="assignStaff(request.id)">
                Phân Công
              </button>
              <button v-if="request.status !== 'Completed'" class="btn btn-primary btn-sm" @click="markAsCompleted(request.id)">
                Đánh Dấu Đã Hoàn Thành
              </button>
              <button v-if="request.status !== 'Canceled'" class="btn btn-danger btn-sm" @click="cancelRequest(request.id)">
                Hủy Yêu Cầu
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Báo Cáo Dịch Vụ -->
      <div class="tab-pane fade" id="reports" role="tabpanel">
        <h2>Báo Cáo Dịch Vụ Bảo Trì</h2>
        <div class="mb-3">
          <label for="reportType" class="form-label">Loại Báo Cáo</label>
          <select v-model="selectedReportType" class="form-select" id="reportType">
            <option value="monthly">Báo cáo theo Tháng</option>
            <option value="quarterly">Báo cáo theo Quý</option>
            <option value="yearly">Báo cáo theo Năm</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="generateReport">Tạo Báo Cáo</button>

        <!-- Hiển thị báo cáo -->
        <div v-if="reportGenerated" class="mt-4">
          <h3>Báo Cáo Dịch Vụ {{ reportPeriod }}</h3>
          <ul>
            <li>Tổng số yêu cầu: {{ reportData.totalRequests }}</li>
            <li>Yêu cầu đã hoàn thành: {{ reportData.completedRequests }}</li>
            <li>Yêu cầu đang xử lý: {{ reportData.inProgressRequests }}</li>
            <li>Yêu cầu đã hủy: {{ reportData.canceledRequests }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminMaintenanceServiceManagement',
  data() {
    return {
      maintenanceRequests: [
        // Dữ liệu giả lập yêu cầu bảo trì
        { id: 1, requester: 'Nguyen Van A', role: 'Tenant', description: 'Bảo trì hệ thống mạng', status: 'Pending', requestDate: '2024-10-01', assignedStaff: null },
        { id: 2, requester: 'Tran Van B', role: 'Landlord', description: 'Sửa chữa hệ thống an ninh', status: 'In Progress', requestDate: '2024-09-25', assignedStaff: 'Le Van C' }
      ],
      selectedReportType: 'monthly',
      reportGenerated: false,
      reportPeriod: '',
      reportData: {
        totalRequests: 0,
        completedRequests: 0,
        inProgressRequests: 0,
        canceledRequests: 0
      }
    };
  },
  methods: {
    assignStaff(requestId) {
      const staffName = prompt('Nhập tên nhân viên xử lý:');
      if (staffName) {
        const request = this.maintenanceRequests.find(req => req.id === requestId);
        if (request) {
          request.assignedStaff = staffName;
          request.status = 'In Progress';
          alert('Yêu cầu đã được phân công.');
        }
      }
    },
    markAsCompleted(requestId) {
      const request = this.maintenanceRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'Completed';
        alert('Yêu cầu đã được đánh dấu là hoàn thành.');
      }
    },
    cancelRequest(requestId) {
      const confirmCancel = confirm('Bạn có chắc muốn hủy yêu cầu này?');
      if (confirmCancel) {
        const request = this.maintenanceRequests.find(req => req.id === requestId);
        if (request) {
          request.status = 'Canceled';
          alert('Yêu cầu đã bị hủy.');
        }
      }
    },
    generateReport() {
      // Dữ liệu giả lập cho báo cáo
      this.reportGenerated = true;
      this.reportPeriod = this.selectedReportType === 'monthly' ? 'Tháng' :
          this.selectedReportType === 'quarterly' ? 'Quý' : 'Năm';

      // Tính toán dữ liệu báo cáo
      this.reportData.totalRequests = this.maintenanceRequests.length;
      this.reportData.completedRequests = this.maintenanceRequests.filter(req => req.status === 'Completed').length;
      this.reportData.inProgressRequests = this.maintenanceRequests.filter(req => req.status === 'In Progress').length;
      this.reportData.canceledRequests = this.maintenanceRequests.filter(req => req.status === 'Canceled').length;
    }
  }
};
</script>

<style scoped>
.admin-maintenance-service-management {
  padding: 20px;
}

.table {
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
