<template>
  <div class="create-home">
    <!-- Header với H2 và các nút Quay về, Lưu -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Thêm Nhà</h3>
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
      <!-- Nhà và Thành phố -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="houseName" class="form-label">Tên Nhà <span >&nbsp;*</span></label>
          <input type="text" v-model="home.name" id="houseName" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.name}" placeholder="Nhập tên nhà" required>
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>

        <div class="col-md-6">
          <label for="city" class="form-label">Tỉnh/ Thành phố <span >&nbsp;*</span></label>
          <input type="text" v-model="home.city" id="city" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.city}" placeholder="Nhập Tỉnh/Thành phố" required>
          <div class="invalid-feedback" v-if="errors.city">{{ errors.city }}</div>
        </div>
      </div>

      <!-- Quận, Phường -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="district" class="form-label">Quận/ Huyện <span >&nbsp;*</span></label>
          <input type="text" v-model="home.district" id="district" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.district}" placeholder="Nhập Quận/Huyện" required>
          <div class="invalid-feedback" v-if="errors.district">{{ errors.district }}</div>
        </div>

        <div class="col-md-6">
          <label for="ward" class="form-label">Phường/ Xã <span >&nbsp;*</span></label>
          <input type="text" v-model="home.ward" id="ward" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.ward}" placeholder="Nhập Phường/Xã" required>
          <div class="invalid-feedback" v-if="errors.ward">{{ errors.ward }}</div>
        </div>
      </div>

      <!-- Địa chỉ -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="address" class="form-label">Địa chỉ <span >&nbsp;*</span></label>
          <input type="text" v-model="home.address" id="address" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.address}" placeholder="Nhập địa chỉ" required>
          <div class="invalid-feedback" v-if="errors.address">{{ errors.address }}</div>
        </div>
      </div>

      <!-- Thông tin bắt buộc -->
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
      errors: {} // Để lưu trữ các lỗi validate
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

      if (!this.home.city) this.errors.city = "Vui lòng nhập Tỉnh/Thành phố";
      if (!this.home.district) this.errors.district = "Vui lòng nhập Quận/Huyện";
      if (!this.home.ward) this.errors.ward = "Vui lòng nhập Phường/Xã";
      if (!this.home.address) this.errors.address = "Vui lòng nhập địa chỉ";

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
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}
</style>
