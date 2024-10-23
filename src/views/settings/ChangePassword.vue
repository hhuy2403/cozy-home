<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="m-0">Thay đổi mật khẩu</h2>
        <div>
          <button type="button" class="btn btn-success me-2" @click="handleSubmit">
            <i class="fas fa-save"></i> Lưu
          </button>
          <button type="button" class="btn btn-secondary" @click="openForgotPasswordModal">
            <i class="fas fa-unlock-alt"></i> Quên mật khẩu
          </button>
        </div>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Mật khẩu hiện tại: *</label>
            <input
                type="password"
                class="form-control"
                id="currentPassword"
                v-model="currentPassword"
                required
            />
          </div>

          <div class="mb-3">
            <label for="newPassword" class="form-label">Mật khẩu mới: *</label>
            <input
                type="password"
                class="form-control"
                id="newPassword"
                v-model="newPassword"
                required
            />
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Nhập lại mật khẩu: *</label>
            <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
                required
            />
          </div>

          <div class="text-danger mb-3" v-if="errorMessage">
            <small>{{ errorMessage }}</small>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="isForgotPasswordModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h5>Quên mật khẩu</h5>
        <p>Nhập email để lấy lại mật khẩu:</p>
        <input
            type="email"
            class="form-control mb-3"
            v-model="forgotPasswordEmail"
            placeholder="Nhập email của bạn"
        />
        <div class="text-danger mb-2" v-if="forgotPasswordError">{{ forgotPasswordError }}</div>
        <button class="btn btn-primary me-2" @click="handleForgotPassword">Xác nhận</button>
        <button class="btn btn-secondary" @click="closeForgotPasswordModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      isForgotPasswordModalOpen: false,
      forgotPasswordEmail: '',
      forgotPasswordError: '',
    };
  },
  methods: {
    handleSubmit() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const users = JSON.parse(localStorage.getItem('users')) || [];

      const decodedPassword = atob(currentUser.password);

      if (this.currentPassword !== decodedPassword) {
        this.errorMessage = 'Mật khẩu hiện tại không chính xác.';
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Mật khẩu mới và mật khẩu nhập lại không khớp.';
        return;
      }

      const encodedNewPassword = btoa(this.newPassword);
      currentUser.password = encodedNewPassword;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      const userIndex = users.findIndex(user => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex].password = encodedNewPassword;
        localStorage.setItem('users', JSON.stringify(users));
      }

      this.clearForm();
      alert('Mật khẩu đã được thay đổi thành công!');
    },
    openForgotPasswordModal() {
      this.isForgotPasswordModalOpen = true;
    },
    closeForgotPasswordModal() {
      this.isForgotPasswordModalOpen = false;
      this.forgotPasswordEmail = '';
      this.forgotPasswordError = '';
    },
    handleForgotPassword() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (this.forgotPasswordEmail !== currentUser.email) {
        this.forgotPasswordError = 'Email không chính xác.';
        return;
      }

      alert(`Mật khẩu của bạn đã được gửi đến email: ${this.forgotPasswordEmail}`);
      this.closeForgotPasswordModal();
    },
    clearForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = '';
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}
</style>
