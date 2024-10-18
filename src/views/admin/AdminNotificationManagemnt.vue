<template>
  <div class="notification-management container">
    <h1 class="my-4">Quản Lý Thông Báo</h1>

    <button class="btn btn-success mb-3" @click="showCreateNotificationModal = true">Tạo Thông Báo Mới</button>

    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nội Dung Thông Báo</th>
        <th>Người Nhận</th>
        <th>Phương Thức Gửi</th>
        <th>Ngày Gửi</th>
        <th>Hành Động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="notification in notifications" :key="notification.id">
        <td>{{ notification.id }}</td>
        <td>{{ notification.content }}</td>
        <td>{{ notification.recipient }}</td>
        <td>{{ notification.method }}</td>
        <td>{{ notification.dateSent }}</td>
        <td>
          <button class="btn btn-danger btn-sm" @click="deleteNotification(notification.id)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal tạo thông báo -->
    <div v-if="showCreateNotificationModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tạo Thông Báo Mới</h5>
            <button type="button" class="btn-close" @click="closeCreateNotificationModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createNotification">
              <div class="mb-3">
                <label for="notificationContent" class="form-label">Nội Dung Thông Báo</label>
                <textarea v-model="newNotification.content" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="recipient" class="form-label">Người Nhận</label>
                <input type="text" v-model="newNotification.recipient" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="method" class="form-label">Phương Thức Gửi</label>
                <select v-model="newNotification.method" class="form-select" required>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="in-system">Thông báo trong hệ thống</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Gửi Thông Báo</button>
              <button type="button" class="btn btn-secondary" @click="closeCreateNotificationModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'NotificationManagement',
  data() {
    return {
      notifications: [
        // Ví dụ dữ liệu thông báo
        { id: 1, content: 'Thông báo bảo trì hệ thống', recipient: 'Người Thuê A', method: 'email', dateSent: '2024-10-01' },
        { id: 2, content: 'Hết hạn hợp đồng', recipient: 'Chủ Nhà B', method: 'sms', dateSent: '2024-10-05' }
      ],
      showCreateNotificationModal: false,
      newNotification: { content: '', recipient: '', method: 'email' },
    };
  },
  methods: {
    createNotification() {
      const newId = this.notifications.length ? this.notifications[this.notifications.length - 1].id + 1 : 1;
      this.notifications.push({
        ...this.newNotification,
        id: newId,
        dateSent: new Date().toISOString().split('T')[0] // Lưu ngày gửi
      });
      this.closeCreateNotificationModal();
    },
    deleteNotification(id) {
      if (confirm('Bạn có chắc muốn xóa thông báo này không?')) {
        this.notifications = this.notifications.filter(notification => notification.id !== id);
      }
    },
    closeCreateNotificationModal() {
      this.showCreateNotificationModal = false;
      this.newNotification = { content: '', recipient: '', method: 'email' };
    },
  },
};
</script>

<style scoped>
.notification-management {
  padding: 20px;
}

.table {
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
