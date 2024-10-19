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
      // Lấy danh sách người dùng từ localStorage
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Kiểm tra xem tài khoản quản trị viên đã tồn tại chưa
      const adminUser = users.find(user => user.email === 'admin@gmail.com');
      if (!adminUser) {
        // Nếu chưa có, thêm tài khoản quản trị viên mặc định
        const newAdmin = {
          id: Date.now(), // ID duy nhất cho tài khoản admin
          name: 'Admin',
          email: 'admin@gmail.com',
          password: 'admin123',
          role: 'admin',
          status: 'active'
        };

        // Thêm tài khoản vào danh sách người dùng
        users.push(newAdmin);

        // Cập nhật lại danh sách người dùng trong localStorage
        localStorage.setItem('users', JSON.stringify(users));
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword; // Thay đổi trạng thái hiển thị mật khẩu
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
    login() {
      // Kiểm tra email và mật khẩu trước khi đăng nhập
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();

      if (!isEmailValid || !isPasswordValid) {
        return;
      }

      // Xử lý đăng nhập giả lập
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
          (u) => u.email === this.email && u.password === this.password
      );

      if (user) {
        // Kiểm tra trạng thái của tài khoản
        if (user.status === 'inactive') {
          this.error = 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.';
          return;
        }

        // Nếu tài khoản còn hoạt động, tiến hành đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === 'admin') {
          this.$router.push('/admin/dashboard');
          localStorage.setItem('userRole', user.role);
        } else if (user.role === 'landlord') {
          localStorage.setItem('userRole', user.role);
          this.$router.push('/landlord/dashboard');
        } else if (user.role === 'tenant') {
          localStorage.setItem('userRole', user.role);
          this.$router.push('/tenant/dashboard');
        }
      } else {
        this.error = 'Email hoặc mật khẩu không chính xác.';
      }
    }
  },
};
</script>
