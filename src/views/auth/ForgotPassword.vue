<template>
  <HeaderComponent/>
  <div class="forgot-password-page">
    <div class="forgot-password-box">
      <h1>Quên mật khẩu</h1>
      <p>Vui lòng nhập địa chỉ email của bạn để nhận liên kết khôi phục mật khẩu.</p>

      <!-- Form nhập email -->
      <form @submit.prevent="submitEmail">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
              type="email"
              v-model="email"
              id="email"
              placeholder="Nhập địa chỉ email của bạn"
              @blur="validateEmail"
              class="form-control"
          />
        </div>
        <small v-if="emailError" class="error-message">{{ emailError }}</small>
        <button type="submit" class="btn btn-primary">Gửi liên kết khôi phục</button>
      </form>

      <!-- Thông báo đã nhớ mật khẩu -->
      <p class="mt-3">
        Đã nhớ mật khẩu?
        <router-link to="/login">Đăng nhập tại đây</router-link>
      </p>

      <!-- Thông báo thành công -->
      <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
      <p v-else-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    </div>
  </div>
  <FooterComponent/>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: 'ForgotPassword',
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      email: '',
      emailError: '',
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.emailError = 'Email không được để trống.';
        return false;
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Địa chỉ email không hợp lệ.';
        return false;
      }
      this.emailError = '';
      return true;
    },
    submitEmail() {
      if (this.validateEmail()) {
        // Lấy danh sách người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Kiểm tra xem email có trong hệ thống hay không
        const user = users.find(u => u.email === this.email);

        if (user) {
          // Nếu email tồn tại, gửi liên kết khôi phục mật khẩu
          this.successMessage = 'Liên kết khôi phục mật khẩu đã được gửi đến email của bạn.';
          this.errorMessage = '';
          console.log('Password reset link sent to:', this.email);

          // Logic để gửi email (giả lập)
          const resetLink = `http://example.com/reset-password?email=${encodeURIComponent(this.email)}`;
          console.log('Reset link:', resetLink);

          // Reset form sau khi gửi thành công
          this.resetForm();
        } else {
          // Nếu email không tồn tại, hiển thị thông báo lỗi
          this.errorMessage = 'Email không tồn tại trong hệ thống.';
          this.successMessage = '';
        }
      }
    },
    resetForm() {
      this.email = '';
      this.emailError = '';
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  margin-top: -20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2a3f54, #3c5067);
  color: #ffffff;
}

.forgot-password-box {
  background-color: #ffffff;
  color: #2a3f54;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #2a3f54;
  box-shadow: 0 0 0 0.2rem rgba(42, 63, 84, 0.25);
}

.btn-primary {
  padding: 10px 20px;
  background-color: #2a3f54;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #1e2d3b;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.9rem;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #ff4d4d;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 576px) {
  .forgot-password-box {
    padding: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .btn-primary {
    padding: 10px 0;
  }
}
</style>
