<template>
  <div class="complaint-feedback-management container">
    <h1 class="my-4">Quản Lý Khiếu Nại và Phản Hồi</h1>

    <!-- Nút thêm khiếu nại mới -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <button @click="showAddComplaintModal = true" class="btn btn-success">Thêm Khiếu Nại Mới</button>
    </div>

    <!-- Danh sách khiếu nại -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-dark">
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('content')">Nội Dung Khiếu Nại</th>
          <th @click="sortBy('sender')">Người Gửi</th>
          <th @click="sortBy('status')">Trạng Thái</th>
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
    </div>

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
import Swal from 'sweetalert2';
import "@/styles/admin/feedback-management.css"

export default {
  name: 'ComplaintFeedbackManagement',
  data() {
    return {
      complaints: [
        { id: 1, content: 'Khiếu nại về dịch vụ bảo trì.', sender: 'Người Thuê A', status: 'Chưa xử lý' },
        { id: 2, content: 'Phản hồi về căn hộ.', sender: 'Chủ Nhà B', status: 'Đang xử lý' }
      ],
      showAddComplaintModal: false,
      newComplaint: { content: '', sender: '' },
      showAssignModal: false,
      assignedHandler: '',
      currentComplaint: null,
      sortKey: '',
      sortAsc: true,
    };
  },
  methods: {
    addComplaint() {
      const newId = this.complaints.length ? this.complaints[this.complaints.length - 1].id + 1 : 1;
      this.complaints.push({ ...this.newComplaint, id: newId, status: 'Chưa xử lý' });
      this.closeComplaintModal();
      Swal.fire('Thành công', 'Khiếu nại mới đã được thêm!', 'success');
    },
    deleteComplaint(id) {
      Swal.fire({
        title: 'Bạn có chắc muốn xóa khiếu nại này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          this.complaints = this.complaints.filter(complaint => complaint.id !== id);
          Swal.fire('Đã Xóa', 'Khiếu nại đã bị xóa.', 'success');
        }
      });
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
          Swal.fire('Phân Công Thành Công', 'Khiếu nại đã được phân công xử lý.', 'success');
        }
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
      this.complaints.sort((a, b) => {
        if (a[key] < b[key]) return this.sortAsc ? -1 : 1;
        if (a[key] > b[key]) return this.sortAsc ? 1 : -1;
        return 0;
      });
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

