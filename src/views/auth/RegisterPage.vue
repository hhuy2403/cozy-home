<template>
  <HeaderComponent/>
  <div class="register-page">
    <div class="register-container">
      <div class="register-box">
        <!-- Tiêu đề đăng ký -->
        <h2 class="register-title">Đăng Ký</h2>

        <!-- Form đăng ký -->
        <form @submit.prevent="registerUser">
          <!-- Name -->
          <div class="mb-3">
            <label for="name" class="form-label">Tên</label>
            <input
                type="text"
                v-model="user.name"
                id="name"
                class="form-control"
                placeholder="Nhập tên của bạn"
                required
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                type="email"
                v-model="user.email"
                id="email"
                class="form-control"
                placeholder="Nhập email"
                required
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input
                type="password"
                v-model="user.password"
                id="password"
                class="form-control"
                placeholder="Nhập mật khẩu"
                required
            />
          </div>

          <!-- Role -->
          <div class="mb-3">
            <label for="role" class="form-label">Vai trò</label>
            <select v-model="user.role" id="role" class="form-control">
              <option value="tenant">Người thuê</option>
              <option value="landlord">Chủ nhà</option>
            </select>
          </div>

          <!-- Nút đăng ký -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg">Đăng Ký</button>
          </div>

          <!-- Thông báo lỗi -->
          <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
        </form>

        <!-- Liên kết quay lại trang đăng nhập -->
        <div class="text-center mt-4">
          <p>Đã có tài khoản? <router-link to="/login" class="back-to-login-link">Quay lại đăng nhập</router-link></p>
        </div>
      </div>
    </div>
  </div>
  <FooterComponent/>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import "@/styles/auth/register.css";

export default {
  name: 'RegisterPage',
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        role: 'tenant',
      },
      errorMessage: '', // Thông báo lỗi nếu có
    };
  },
  methods: {
    registerUser() {
      // Lấy danh sách người dùng từ localStorage (nếu có)
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Kiểm tra xem email đã tồn tại hay chưa
      const existingUser = users.find(u => u.email === this.user.email);
      if (existingUser) {
        this.errorMessage = 'Email này đã được đăng ký.';
        return;
      }

      // Nếu email chưa tồn tại, thêm người dùng vào danh sách
      users.push(this.user);

      // Lưu danh sách người dùng mới vào localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Hiển thị thông báo đăng ký thành công và chuyển hướng đến trang login
      alert('Đăng ký thành công! Bạn có thể đăng nhập bây giờ.');
      this.$router.push('/login');
    }
  }
};
</script>

