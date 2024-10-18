<template>
  <div class="system-settings container">
    <h1 class="my-4">Quản Lý Thông Tin Hệ Thống</h1>

    <div class="mb-4">
      <h3>Cấu Hình Email</h3>
      <form @submit.prevent="updateEmailSettings">
        <div class="mb-3">
          <label for="emailService" class="form-label">Dịch Vụ Email</label>
          <select v-model="emailSettings.service" class="form-select" required>
            <option value="gmail">Gmail</option>
            <option value="yahoo">Yahoo</option>
            <option value="smtp">SMTP</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="emailAddress" class="form-label">Địa Chỉ Email</label>
          <input type="email" v-model="emailSettings.address" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="emailPassword" class="form-label">Mật Khẩu Email</label>
          <input type="password" v-model="emailSettings.password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success">Cập Nhật Cài Đặt Email</button>
      </form>
    </div>

    <div class="mb-4">
      <h3>Cài Đặt Phương Thức Thanh Toán</h3>
      <form @submit.prevent="updatePaymentSettings">
        <div class="mb-3">
          <label for="paymentMethod" class="form-label">Phương Thức Thanh Toán</label>
          <select v-model="paymentSettings.method" class="form-select" required>
            <option value="credit-card">Thẻ Tín Dụng</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Chuyển Khoản Ngân Hàng</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">Cập Nhật Cài Đặt Thanh Toán</button>
      </form>
    </div>

    <div class="mb-4">
      <h3>Sao Lưu và Khôi Phục Dữ Liệu</h3>
      <button class="btn btn-warning" @click="backupData">Sao Lưu Dữ Liệu</button>
      <button class="btn btn-info" @click="restoreData">Khôi Phục Dữ Liệu</button>
    </div>

    <div v-if="backupMessage" class="alert alert-success">
      {{ backupMessage }}
    </div>
    <div v-if="restoreMessage" class="alert alert-success">
      {{ restoreMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemSettings',
  data() {
    return {
      emailSettings: {
        service: 'gmail',
        address: '',
        password: '',
      },
      paymentSettings: {
        method: 'credit-card',
      },
      backupMessage: '',
      restoreMessage: '',
    };
  },
  methods: {
    updateEmailSettings() {
      // Logic to save email settings (e.g., call an API)
      alert('Cài đặt email đã được cập nhật!');
    },
    updatePaymentSettings() {
      // Logic to save payment settings (e.g., call an API)
      alert('Cài đặt phương thức thanh toán đã được cập nhật!');
    },
    backupData() {
      // Logic to perform data backup (e.g., call an API)
      this.backupMessage = 'Dữ liệu đã được sao lưu thành công!';
    },
    restoreData() {
      // Logic to perform data restore (e.g., call an API)
      this.restoreMessage = 'Dữ liệu đã được khôi phục thành công!';
    },
  },
};
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
