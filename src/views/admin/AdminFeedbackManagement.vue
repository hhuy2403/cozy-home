<template>
  <div class="complaint-feedback-management container">
    <h1 class="my-4">Quản Lý Khiếu Nại và Phản Hồi</h1>

    <button class="btn btn-success mb-3" @click="showAddComplaintModal = true">Thêm Khiếu Nại Mới</button>

    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nội Dung Khiếu Nại</th>
        <th>Người Gửi</th>
        <th>Trạng Thái</th>
        <th>Hành Động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="complaint in complaints" :key="complaint.id">
        <td>{{ complaint.id }}</td>
        <td>{{ complaint.content }}</td>
        <td>{{ complaint.sender }}</td>
        <td>{{ complaint.status }}</td>
        <td>
          <button class="btn btn-primary btn-sm" @click="assignHandling(complaint)">Phân Công Xử Lý</button>
          <button class="btn btn-danger btn-sm" @click="deleteComplaint(complaint.id)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal thêm khiếu nại -->
    <div v-if="showAddComplaintModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Khiếu Nại Mới</h5>
            <button type="button" class="btn-close" @click="closeComplaintModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addComplaint">
              <div class="mb-3">
                <label for="complaintContent" class="form-label">Nội Dung Khiếu Nại</label>
                <textarea v-model="newComplaint.content" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="sender" class="form-label">Người Gửi</label>
                <input type="text" v-model="newComplaint.sender" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success">Thêm</button>
              <button type="button" class="btn btn-secondary" @click="closeComplaintModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal phân công xử lý -->
    <div v-if="showAssignModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Phân Công Xử Lý Khiếu Nại</h5>
            <button type="button" class="btn-close" @click="closeAssignModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleAssignment">
              <div class="mb-3">
                <label for="handler" class="form-label">Người Xử Lý</label>
                <input type="text" v-model="assignedHandler" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success">Phân Công</button>
              <button type="button" class="btn btn-secondary" @click="closeAssignModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplaintFeedbackManagement',
  data() {
    return {
      complaints: [
        // Ví dụ dữ liệu
        { id: 1, content: 'Khiếu nại về dịch vụ bảo trì.', sender: 'Người Thuê A', status: 'Chưa xử lý' },
        { id: 2, content: 'Phản hồi về căn hộ.', sender: 'Chủ Nhà B', status: 'Đang xử lý' }
      ],
      showAddComplaintModal: false,
      newComplaint: { content: '', sender: '' },
      showAssignModal: false,
      assignedHandler: '',
      currentComplaint: null,
    };
  },
  methods: {
    addComplaint() {
      const newId = this.complaints.length ? this.complaints[this.complaints.length - 1].id + 1 : 1;
      this.complaints.push({ ...this.newComplaint, id: newId, status: 'Chưa xử lý' });
      this.closeComplaintModal();
    },
    deleteComplaint(id) {
      if (confirm('Bạn có chắc muốn xóa khiếu nại này không?')) {
        this.complaints = this.complaints.filter(complaint => complaint.id !== id);
      }
    },
    assignHandling(complaint) {
      this.currentComplaint = complaint;
      this.showAssignModal = true;
    },
    handleAssignment() {
      if (this.assignedHandler) {
        const index = this.complaints.findIndex(complaint => complaint.id === this.currentComplaint.id);
        if (index !== -1) {
          this.complaints[index].status = 'Đang xử lý';
          this.closeAssignModal();
        }
      }
    },
    closeComplaintModal() {
      this.showAddComplaintModal = false;
      this.newComplaint = { content: '', sender: '' };
    },
    closeAssignModal() {
      this.showAssignModal = false;
      this.assignedHandler = '';
      this.currentComplaint = null;
    },
  },
};
</script>

<style scoped>
.complaint-feedback-management {
  padding: 20px;
}

.table {
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
