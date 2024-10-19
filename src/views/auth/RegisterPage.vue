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
            <p v-if="errors.name" class="text-danger">{{ errors.name }}</p>
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
            <p v-if="errors.email" class="text-danger">{{ errors.email }}</p>
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
            <p v-if="errors.password" class="text-danger">{{ errors.password }}</p>
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
import Swal from 'sweetalert2';
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
        status: 'active' // Trạng thái mặc định là active
      },
      errors: {}, // Lưu trữ các lỗi validation
      errorMessage: '', // Thông báo lỗi nếu có
    };
  },
  methods: {
    validateForm() {
      // Reset lỗi
      this.errors = {};

      // Kiểm tra tên
      if (!this.user.name) {
        this.errors.name = 'Vui lòng nhập tên.';
      }

      // Kiểm tra email (định dạng và trùng lặp)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.user.email) {
        this.errors.email = 'Vui lòng nhập email.';
      } else if (!emailPattern.test(this.user.email)) {
        this.errors.email = 'Email không hợp lệ.';
      }

      // Kiểm tra mật khẩu
      if (!this.user.password) {
        this.errors.password = 'Vui lòng nhập mật khẩu.';
      } else if (this.user.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
      }

      // Trả về true nếu không có lỗi
      return Object.keys(this.errors).length === 0;
    },
    registerUser() {
      // Validate form trước khi tiếp tục
      if (!this.validateForm()) {
        return;
      }

      // Lấy danh sách người dùng từ localStorage (nếu có)
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Kiểm tra xem email đã tồn tại hay chưa
      const existingUser = users.find(u => u.email === this.user.email);
      if (existingUser) {
        this.errorMessage = 'Email này đã được đăng ký.';
        return;
      }

      // Tạo ID duy nhất cho người dùng mới
      const newUserId = Date.now();

      // Thêm ID vào thông tin người dùng
      const newUser = {
        id: newUserId,
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        role: this.user.role,
        status: this.user.status,
      };

      // Thêm người dùng vào danh sách
      users.push(newUser);

      // Lưu danh sách người dùng mới vào localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Sử dụng SweetAlert2 để hiển thị thông báo đăng ký thành công
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: `ID của bạn là ${newUserId}. Bạn có thể đăng nhập bây giờ.`,
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true
      }).then(() => {
        this.$router.push('/login');
      });
    }
  }
};
</script>


