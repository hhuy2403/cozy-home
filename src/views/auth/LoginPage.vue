<template>
  <!-- Header Component -->
  <HeaderComponent/>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <!-- Tiêu đề đăng nhập -->
        <h2 class="login-title">Đăng Nhập</h2>

        <!-- Form đăng nhập -->
        <form @submit.prevent="login">
          <!-- Email -->
          <label for="email" class="form-label">Email</label>
          <div class="mb-3">
            <input
                v-model="email"
                id="email"
                type="email"
                class="form-control"
                placeholder="Nhập email"
                @blur="validateEmail"
            />
          </div>
          <small v-if="emailError" class="text-danger">{{ emailError }}</small>

          <!-- Mật khẩu -->
          <label for="password" class="form-label">Mật khẩu</label>
          <div class="mb-3 password-wrapper">
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="Nhập mật khẩu"
                class="login-input form-control"
                @blur="validatePassword"
            />
            <button type="button" @click="togglePassword" class="toggle-password-btn">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>

          <!-- Nút đăng nhập -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg">Đăng Nhập</button>
          </div>

          <!-- Thông báo lỗi -->
          <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
        </form>

        <!-- Footer với các liên kết -->
        <div class="text-center mt-4 login-footer">
          <router-link to="/forgot-password" class="forgot-password-link">Quên mật khẩu?</router-link>
          <p class="mt-2">
            Chưa có tài khoản?
            <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
  <FooterComponent/>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import "@/styles/auth/login.css";

export default {
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      email: '',
      password: '',
      showPassword: false, // Điều khiển hiển thị/ẩn mật khẩu
      error: '',
      emailError: '',
      passwordError: '',
    };
  },
  created() {
    // Thêm tài khoản quản trị viên mặc định nếu chưa có trong localStorage
    this.addDefaultAdmin();
  },
  methods: {
    addDefaultAdmin() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const adminUser = users.find(user => user.email === 'admin@gmail.com');
      if (!adminUser) {
        const newAdmin = {
          id: Date.now(),
          name: 'Admin',
          email: 'admin@gmail.com',
          password: this.hashPassword('admin123'),
          role: 'admin',
          status: 'active'
        };
        users.push(newAdmin);
        localStorage.setItem('users', JSON.stringify(users));
      }
    },
    hashPassword(password) {
      // Simple hash simulation (for demo purposes only)
      return btoa(password); // Encode to Base64
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    validateEmail() {
      if (!this.email) {
        this.emailError = 'Email không được để trống.';
        return false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = 'Địa chỉ email không hợp lệ.';
        return false;
      }
      this.emailError = '';
      return true;
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Mật khẩu không được để trống.';
        return false;
      }
      if (this.password.length < 6) {
        this.passwordError = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return false;
      }
      this.passwordError = '';
      return true;
    },
    validateForm() {
      return this.validateEmail() && this.validatePassword();
    },
    login() {
      if (!this.validateForm()) return;

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const hashedPassword = this.hashPassword(this.password);
      const user = users.find(
          (u) => u.email === this.email && u.password === hashedPassword
      );

      if (user) {
        if (user.status === 'inactive') {
          this.error = 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.';
          return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        switch (user.role) {
          case 'admin':
            this.$router.push('/admin/dashboard');
            break;
          case 'landlord':
            this.$router.push('/landlord/dashboard');
            break;
          case 'tenant':
            this.$router.push('/tenant/dashboard');
            break;
        }
      } else {
        this.error = 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra hoặc đăng ký nếu bạn chưa có tài khoản.';
      }
    }
  },
};
</script>
