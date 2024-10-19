<template>
  <div class="create-home">
    <!-- Header với H2 bên trái và các nút bên phải -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- Tiêu đề h2 -->
      <h2>Thêm Nhà</h2>

      <!-- Nút Quay về và Lưu bên phải -->
      <div>
        <router-link to="/landlord/room-index">
          <button type="button" class="btn btn-warning me-2">
            <i class="fa fa-undo"></i> Quay về
          </button>
        </router-link>
        <button type="submit" class="btn btn-success" @click="validateAndSave">
          <i class="fa fa-check"></i> Lưu
        </button>
      </div>
    </div>

    <form @submit.prevent="validateAndSave">
      <!-- Form Fields -->
      <div class="row mb-3">
        <!-- Nhà -->
        <div class="col-md-6">
          <label for="houseName" class="form-label">Nhà <span class="text-danger">*</span></label>
          <input type="text" v-model="home.name" id="houseName" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Nhập tên nhà" required>
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>

        <!-- Tỉnh/Thành phố -->
        <div class="col-md-6">
          <label for="city" class="form-label">Tỉnh/ Thành phố <span class="text-danger">*</span></label>
          <input type="text" v-model="home.city" id="city" class="form-control" :class="{'is-invalid': errors.city}" placeholder="Nhập Tỉnh/Thành phố" required>
          <div class="invalid-feedback" v-if="errors.city">Vui lòng nhập Tỉnh/Thành phố</div>
        </div>
      </div>

      <div class="row mb-3">
        <!-- Quận/Huyện -->
        <div class="col-md-6">
          <label for="district" class="form-label">Quận/ Huyện <span class="text-danger">*</span></label>
          <input type="text" v-model="home.district" id="district" class="form-control" :class="{'is-invalid': errors.district}" placeholder="Nhập Quận/Huyện" required>
          <div class="invalid-feedback" v-if="errors.district">Vui lòng nhập Quận/Huyện</div>
        </div>

        <!-- Phường/Xã -->
        <div class="col-md-6">
          <label for="ward" class="form-label">Phường/ Xã <span class="text-danger">*</span></label>
          <input type="text" v-model="home.ward" id="ward" class="form-control" :class="{'is-invalid': errors.ward}" placeholder="Nhập Phường/Xã" required>
          <div class="invalid-feedback" v-if="errors.ward">Vui lòng nhập Phường/Xã</div>
        </div>
      </div>

      <div class="row mb-3">
        <!-- Địa chỉ -->
        <div class="col-md-6">
          <label for="address" class="form-label">Địa chỉ <span class="text-danger">*</span></label>
          <input type="text" v-model="home.address" id="address" class="form-control" :class="{'is-invalid': errors.address}" placeholder="Nhập địa chỉ" required>
          <div class="invalid-feedback" v-if="errors.address">Vui lòng nhập địa chỉ</div>
        </div>
      </div>

      <!-- Required Info -->
      <div class="mb-4">
        <span class="text-danger">(*): Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "CreateHome",
  data() {
    return {
      home: {
        name: "",
        city: "",
        district: "",
        ward: "",
        address: ""
      },
      errors: {} // Object to store validation errors
    };
  },
  methods: {
    validateAndSave() {
      this.errors = {}; // Xóa các lỗi trước đó

      // Thực hiện kiểm tra validation
      if (!this.home.name) {
        this.errors.name = "Vui lòng nhập tên nhà";
      } else if (this.isHouseNameDuplicate(this.home.name)) {
        this.errors.name = "Tên nhà đã tồn tại, vui lòng nhập tên khác";
      }

      if (!this.home.city) this.errors.city = true;
      if (!this.home.district) this.errors.district = true;
      if (!this.home.ward) this.errors.ward = true;
      if (!this.home.address) this.errors.address = true;

      // Nếu không có lỗi, thực hiện lưu
      if (Object.keys(this.errors).length === 0) {
        this.saveHome();
      }
    },

    // Kiểm tra xem tên nhà có bị trùng không
    isHouseNameDuplicate(name) {
      const homes = JSON.parse(localStorage.getItem("homes")) || [];
      return homes.some(house => house.name === name); // Trả về true nếu tên nhà đã tồn tại
    },

    saveHome() {
      // Lấy danh sách các nhà từ localStorage, hoặc tạo mảng mới nếu không có
      let homes = JSON.parse(localStorage.getItem("homes")) || [];

      // Thêm dữ liệu nhà mới vào mảng
      homes.push(this.home);

      // Lưu danh sách nhà cập nhật vào localStorage
      localStorage.setItem("homes", JSON.stringify(homes));

      // Thông báo hoặc điều hướng sau khi lưu
      alert("Nhà đã được lưu thành công!");

      // Điều hướng về trang danh sách phòng sau khi lưu
      this.$router.push("/landlord/room-index");
    }
  }
};
</script>

<style scoped>
.create-home {
  margin-top: 30px;
  padding: 20px;
}

.header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.form-label {
  font-weight: 600;
}

.form-select, .form-control {
  border-radius: 5px;
}

button {
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}
</style>
