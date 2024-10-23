<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Cấu hình</h2>
      <div>
        <button type="reset" class="btn btn-secondary"><i class="fas fa-refresh"></i> Nhập lại</button>
        <button type="button" class="btn btn-primary mr-2" @click="saveOwnerInfo"><i class="fas fa-save"></i> Lưu</button>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link active" href="#">Thông tin chủ trọ</a>
          </li>
          <!-- Các tab khác có thể được thêm vào đây -->
        </ul>

        <!-- Form Section -->
        <form>
          <div class="form-group row mb-3">
            <label for="name" class="col-sm-2 col-form-label">Họ tên:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="name" v-model="owner.name">
            </div>
          </div>

          <div class="form-group row mb-3">
            <label for="id-number" class="col-sm-2 col-form-label">CMND/ CCCD số:</label>
            <div class="col-sm-4">
              <input type="text" class="form-control" id="id-number" v-model="owner.identityCard">
            </div>
            <label for="issue-date" class="col-sm-2 col-form-label">Ngày cấp:</label>
            <div class="col-sm-4">
              <input type="date" class="form-control" id="issue-date" v-model="owner.issueDate">
            </div>
          </div>

          <div class="form-group row mb-3">
            <label for="phone" class="col-sm-2 col-form-label">Điện thoại:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="phone" v-model="owner.phone">
            </div>
          </div>

          <div class="form-group row mb-3">
            <label for="address" class="col-sm-2 col-form-label">Địa chỉ:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="address" v-model="owner.address">
            </div>
          </div>

          <div class="form-group row mb-3">
            <label for="city" class="col-sm-2 col-form-label">Tỉnh/TP:</label>
            <div class="col-sm-4">
              <select class="form-control" id="city" v-model="owner.city">
                <option>Hà Nội</option>
                <option>Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
                <!-- Thêm các tùy chọn khác nếu cần -->
              </select>
            </div>
            <label for="district" class="col-sm-2 col-form-label">Quận/ huyện:</label>
            <div class="col-sm-4">
              <select class="form-control" id="district" v-model="owner.district">
                <option>Hoàng Mai</option>
                <option>Thanh Xuân</option>
                <option>Hai Bà Trưng</option>
                <!-- Thêm các tùy chọn khác -->
              </select>
            </div>
          </div>

          <div class="form-group row mb-3">
            <label for="ward" class="col-sm-2 col-form-label">Phường/ xã:</label>
            <div class="col-sm-4">
              <select class="form-control" id="ward" v-model="owner.ward">
                <option>Đại Kim</option>
                <option>Kim Giang</option>
                <!-- Thêm các tùy chọn khác -->
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingIndex',
  data() {
    return {
      owner: {
        name: '',
        identityCard: '',
        issueDate: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: ''
      }
    };
  },
  mounted() {
    this.loadOwnerInfo();
  },
  methods: {
    // Lấy thông tin chủ trọ từ localStorage
    loadOwnerInfo() {
      const storedData = localStorage.getItem('currentUser');
      if (storedData) {
        const userData = JSON.parse(storedData);
        this.owner.name = userData.name || '';
        this.owner.identityCard = userData.identityCard || '';
        this.owner.phone = userData.phone || '';
        this.owner.address = '250 Kim Giang'; // Địa chỉ cố định trong dữ liệu mẫu
        this.owner.city = 'Hà Nội';
        this.owner.district = 'Hoàng Mai';
        this.owner.ward = 'Đại Kim';
      }
    },
    // Lưu thông tin chỉnh sửa vào localStorage
    saveOwnerInfo() {
      // Lấy thông tin hiện tại từ localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const users = JSON.parse(localStorage.getItem('users'));

      // Cập nhật thông tin chủ trọ hiện tại
      const updatedUser = {
        ...currentUser,  // giữ các thuộc tính khác như id, email, password...
        name: this.owner.name,
        identityCard: this.owner.identityCard,
        phone: this.owner.phone,
        address: this.owner.address,
        city: this.owner.city,
        district: this.owner.district,
        ward: this.owner.ward
      };

      // Cập nhật trong mảng users
      const updatedUsers = users.map(user =>
          user.id === currentUser.id ? { ...user, name: this.owner.name } : user
      );

      // Lưu lại vào localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      alert('Đã lưu thông tin chủ trọ thành công!');
    }
  }
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

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.nav-tabs .nav-link.active {
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #f8f9fa;
}

.nav-tabs .nav-link {
  color: #495057;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style>
