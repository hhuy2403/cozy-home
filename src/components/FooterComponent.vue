<template>
  <footer class="footer py-4 bg-dark text-white">
    <div class="container">
      <div class="row">
        <!-- Cột 1: Giới thiệu -->
        <div class="col-md-4">
          <h5 class="footer-title"><i class="fas fa-house"></i> CozyHome</h5>
          <p>
            CozyHome là giải pháp quản lý nhà trọ hiện đại, dễ dàng và hiệu quả
            trong quản lý tài sản, hợp đồng và thanh toán.
          </p>
        </div>

        <!-- Cột 2: Liên kết nhanh -->
        <div class="col-md-4">
          <h5 class="footer-title">
            <i class="fas fa-link>"></i> Liên Kết Nhanh
          </h5>
          <ul class="footer-links">
            <li>
              <router-link to="/">Trang Chủ</router-link>
            </li>
            <li>
              <router-link to="">Giới Thiệu</router-link>
            </li>
            <li>
              <router-link to="">Liên Hệ</router-link>
            </li>
            <li>
              <router-link to="/login">Đăng Nhập</router-link>
            </li>
            <li>
              <router-link to="/register">Đăng Ký</router-link>
            </li>
          </ul>
        </div>

        <!-- Cột 3: Thông tin liên hệ -->
        <div class="col-md-4">
          <h5 class="footer-title"><i class="fas fa-envelope"></i> Liên Hệ</h5>
          <p>
            <i class="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận XYZ,
            TP.HCM
          </p>
          <p><i class="fas fa-phone-alt"></i> 0123 456 789</p>
          <p><i class="fas fa-envelope"></i> contact@cozyhome.vn</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.footer {
  background-color: #2a3f54; /* Màu nền như HeaderComponent */
}

.footer-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
}

.footer-links {
  list-style-type: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links li a {
  color: #ffffff;
  text-decoration: none;
}

.footer-links li a:hover {
  color: #ff9800;
  text-decoration: underline;
}

.footer p,
.footer i {
  color: #ffffff;
  margin-bottom: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    text-align: center;
  }

  .footer-title {
    margin-bottom: 20px;
  }

  .footer-links {
    padding-left: 0;
  }
}
</style>
