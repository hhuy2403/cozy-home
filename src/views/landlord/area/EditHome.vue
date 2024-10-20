<template>
  <div class="edit-home">
    <!-- Header với H2 và các nút Lưu, Quay về -->
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

    <!-- Form chỉnh sửa nhà -->
    <form @submit.prevent="validateAndSave">
      <!-- Tên nhà và Thành phố -->
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

      <!-- Quận và Phường -->
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

      <!-- Địa chỉ -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="address" class="form-label">Địa chỉ <span>&nbsp;*</span></label>
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
  name: "EditHome",
  data() {
    return {
      home: {
        name: "",
        city: "",
        district: "",
        ward: "",
        address: ""
      },
      originalName: "", // Tên ban đầu để kiểm tra xem có thay đổi không
      errors: {} // Để lưu lỗi validate
    };
  },
  mounted() {
    this.loadHomeData();
  },
  methods: {
    loadHomeData() {
      const houseName = this.$route.query.house;
      const storedHomes = JSON.parse(localStorage.getItem("homes")) || [];

      // Tìm nhà dựa trên tên
      const home = storedHomes.find(home => home.name === houseName);
      if (home) {
        this.home = { ...home }; // Sao chép dữ liệu nhà
        this.originalName = home.name; // Giữ lại tên ban đầu
      } else {
        alert("Không tìm thấy nhà");
        this.$router.push("/landlord/room-index");
      }
    },
    validateAndSave() {
      this.errors = {};

      // Kiểm tra trùng tên nhà
      const storedHomes = JSON.parse(localStorage.getItem("homes")) || [];
      if (!this.home.name) {
        this.errors.name = "Vui lòng nhập tên nhà";
      } else if (
          this.home.name !== this.originalName && // Kiểm tra nếu tên đã thay đổi
          storedHomes.some(home => home.name === this.home.name)
      ) {
        this.errors.name = "Tên nhà đã tồn tại, vui lòng nhập tên khác";
      }

      // Kiểm tra các trường bắt buộc khác
      if (!this.home.city) this.errors.city = "Vui lòng nhập Tỉnh/Thành phố";
      if (!this.home.district) this.errors.district = "Vui lòng nhập Quận/Huyện";
      if (!this.home.ward) this.errors.ward = "Vui lòng nhập Phường/Xã";
      if (!this.home.address) this.errors.address = "Vui lòng nhập địa chỉ";

      // Nếu không có lỗi, lưu nhà
      if (Object.keys(this.errors).length === 0) {
        this.saveHome();
      }
    },
    saveHome() {
      let homes = JSON.parse(localStorage.getItem("homes")) || [];
      let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

      // Tìm và cập nhật nhà
      const index = homes.findIndex(home => home.name === this.originalName);
      if (index !== -1) {
        homes[index] = this.home; // Cập nhật thông tin nhà

        // Cập nhật tên nhà trong danh sách phòng
        rooms = rooms.map(room => {
          if (room.house === this.originalName) {
            room.house = this.home.name; // Cập nhật tên nhà mới cho các phòng
          }
          return room;
        });

        // Lưu lại vào localStorage
        localStorage.setItem("homes", JSON.stringify(homes));
        localStorage.setItem("rooms", JSON.stringify(rooms));

        alert("Nhà và các phòng liên quan đã được cập nhật thành công!");
        this.$router.push("/landlord/room-index");
      } else {
        alert("Không tìm thấy nhà");
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

input.form-control-sm {
  font-size: 0.875rem;
}
</style>
