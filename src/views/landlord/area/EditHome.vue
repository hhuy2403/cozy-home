<template>
  <div class="edit-home">
    <!-- Header với H2 bên trái và các nút bên phải -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Chỉnh sửa Nhà</h2>
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
        <!-- Tên nhà (cho phép chỉnh sửa) -->
        <div class="col-md-6">
          <label for="houseName" class="form-label">Tên Nhà <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="home.name"
              id="houseName"
              class="form-control"
              :class="{'is-invalid': errors.name}"
              placeholder="Nhập tên nhà"
              required
          />
          <div class="invalid-feedback" v-if="errors.name">
            {{ errors.name }}
          </div>
        </div>

        <!-- Các trường khác -->
        <div class="col-md-6">
          <label for="city" class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="home.city"
              id="city"
              class="form-control"
              :class="{'is-invalid': errors.city}"
              placeholder="Nhập Tỉnh/Thành phố"
              required
          />
          <div class="invalid-feedback" v-if="errors.city">Vui lòng nhập Tỉnh/Thành phố</div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="district" class="form-label">Quận/Huyện <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="home.district"
              id="district"
              class="form-control"
              :class="{'is-invalid': errors.district}"
              placeholder="Nhập Quận/Huyện"
              required
          />
          <div class="invalid-feedback" v-if="errors.district">Vui lòng nhập Quận/Huyện</div>
        </div>

        <div class="col-md-6">
          <label for="ward" class="form-label">Phường/Xã <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="home.ward"
              id="ward"
              class="form-control"
              :class="{'is-invalid': errors.ward}"
              placeholder="Nhập Phường/Xã"
              required
          />
          <div class="invalid-feedback" v-if="errors.ward">Vui lòng nhập Phường/Xã</div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="address" class="form-label">Địa chỉ <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="home.address"
              id="address"
              class="form-control"
              :class="{'is-invalid': errors.address}"
              placeholder="Nhập địa chỉ"
              required
          />
          <div class="invalid-feedback" v-if="errors.address">Vui lòng nhập Địa chỉ</div>
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
      originalName: "", // Lưu tên ban đầu để kiểm tra xem tên có thay đổi không
      errors: {} // Object để lưu lỗi validate
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
  margin-top: 30px;
  padding: 20px;
}

.form-label {
  font-weight: 600;
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
