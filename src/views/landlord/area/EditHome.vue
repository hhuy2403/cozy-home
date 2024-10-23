<template>
  <div class="edit-home">
    <!-- Header with H2 and Save, Back buttons -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">Chỉnh sửa Nhà</h3>
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

    <!-- Form to edit house details -->
    <form @submit.prevent="validateAndSave">
      <!-- House Name and City -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="houseName" class="form-label">Tên Nhà <span>&nbsp;*</span></label>
          <input type="text" v-model="home.name" id="houseName" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.name}" placeholder="Nhập tên nhà" required>
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>

        <div class="col-md-6">
          <label for="city" class="form-label">Tỉnh/Thành phố <span>&nbsp;*</span></label>
          <input type="text" v-model="home.city" id="city" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.city}" placeholder="Nhập Tỉnh/Thành phố" required>
          <div class="invalid-feedback" v-if="errors.city">{{ errors.city }}</div>
        </div>
      </div>

      <!-- District and Ward -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="district" class="form-label">Quận/Huyện <span>&nbsp;*</span></label>
          <input type="text" v-model="home.district" id="district" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.district}" placeholder="Nhập Quận/Huyện" required>
          <div class="invalid-feedback" v-if="errors.district">{{ errors.district }}</div>
        </div>

        <div class="col-md-6">
          <label for="ward" class="form-label">Phường/Xã <span>&nbsp;*</span></label>
          <input type="text" v-model="home.ward" id="ward" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.ward}" placeholder="Nhập Phường/Xã" required>
          <div class="invalid-feedback" v-if="errors.ward">{{ errors.ward }}</div>
        </div>
      </div>

      <!-- Address -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="address" class="form-label">Địa chỉ <span>&nbsp;*</span></label>
          <input type="text" v-model="home.address" id="address" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.address}" placeholder="Nhập địa chỉ" required>
          <div class="invalid-feedback" v-if="errors.address">{{ errors.address }}</div>
        </div>
      </div>

      <!-- Required Information Note -->
      <div class="mb-4">
        <span class="text-danger">(*): Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "EditHome",
  data() {
    return {
      home: {
        id: "",
        name: "",
        city: "",
        district: "",
        ward: "",
        address: "",
        rooms: [] // Array of rooms associated with the house
      },
      originalId: "", // Track the original home ID
      errors: {} // Store validation errors
    };
  },
  mounted() {
    this.loadHomeData(); // Load house data when component mounts
  },
  methods: {
    loadHomeData() {
      const houseName = this.$route.query.houseName; // Nhận houseName từ query
      const storedHomes = JSON.parse(localStorage.getItem('homes')) || [];

      // Tìm nhà dựa trên tên nhà
      const home = storedHomes.find(home => home.name === houseName);

      if (home) {
        this.home = { ...home }; // Gán dữ liệu nhà vào đối tượng home
        this.originalId = home.id; // Lưu lại ID gốc của nhà
      } else {
        alert('Không tìm thấy nhà!');
        this.$router.push('/landlord/room-index');
      }
    },
    validateAndSave() {
      this.errors = {}; // Xóa lỗi cũ

      // Kiểm tra các trường bắt buộc
      if (!this.home.name) this.errors.name = "Vui lòng nhập tên nhà";
      if (!this.home.city) this.errors.city = "Vui lòng nhập Tỉnh/Thành phố";
      if (!this.home.district) this.errors.district = "Vui lòng nhập Quận/Huyện";
      if (!this.home.ward) this.errors.ward = "Vui lòng nhập Phường/Xã";
      if (!this.home.address) this.errors.address = "Vui lòng nhập địa chỉ";

      // Nếu không có lỗi, lưu thông tin nhà
      if (Object.keys(this.errors).length === 0) {
        this.saveHome();
      }
    },
    saveHome() {
      let homes = JSON.parse(localStorage.getItem('homes')) || [];

      // Tìm và cập nhật nhà
      const index = homes.findIndex(home => home.id === this.originalId); // Tìm nhà bằng ID gốc
      if (index !== -1) {
        homes[index] = {
          ...this.home,
          id: this.originalId // Đảm bảo ID gốc không thay đổi
        };

        localStorage.setItem('homes', JSON.stringify(homes)); // Lưu lại vào localStorage
        alert('Nhà đã được cập nhật thành công!');
        this.$router.push('/landlord/room-index'); // Chuyển về trang danh sách phòng
      } else {
        alert('Không tìm thấy nhà!');
      }
    }
  }
};
</script>

<style scoped>
.edit-home {
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #2a3f54;
  font-size: 30px;
  font-weight: 500;
  line-height: 48px;
  text-align: left;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}

input.form-control-sm {
  font-size: 0.875rem;
}
</style>
