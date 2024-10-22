<template>
  <div class="edit-room">
    <!-- Header with title and buttons -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Chỉnh sửa phòng</h3>
      <div>
        <router-link to="/landlord/room-index">
          <button type="button" class="btn btn-warning me-2">
            <i class="fa fa-undo"></i> Quay về
          </button>
        </router-link>
        <button type="submit" class="btn btn-success" @click="validateAndSave">
          <i class="fa fa-save"></i> Lưu
        </button>
      </div>
    </div>

    <form @submit.prevent="validateAndSave">
      <!-- Room Number and House -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="roomNumber" class="form-label">Phòng số <span>&nbsp;*</span></label>
          <input type="text" v-model="room.roomNumber" id="roomNumber" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.roomNumber}" placeholder="Nhập số phòng" required />
          <div class="invalid-feedback" v-if="errors.roomNumber">Vui lòng nhập số phòng</div>
        </div>
        <div class="col-md-6">
          <label for="house" class="form-label">Nhà <span>&nbsp;*</span></label>
          <select id="house" v-model="room.house" class="form-select form-select-sm"
                  :class="{'is-invalid': errors.house}" required>
            <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.house">Vui lòng chọn nhà</div>
        </div>
      </div>

      <!-- Price and Dimensions -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="price" class="form-label">Đơn giá (VNĐ) <span>&nbsp;*</span></label>
          <input type="number" v-model="room.price" id="price" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.price}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.price">Vui lòng nhập đơn giá</div>
        </div>
        <div class="col-md-4">
          <label for="length" class="form-label">Dài (M) <span>&nbsp;*</span></label>
          <input type="number" v-model="room.length" id="length" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.length}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.length">Vui lòng nhập chiều dài</div>
        </div>
        <div class="col-md-4">
          <label for="width" class="form-label">Rộng (M) <span>&nbsp;*</span></label>
          <input type="number" v-model="room.width" id="width" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.width}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.width">Vui lòng nhập chiều rộng</div>
        </div>
      </div>

      <!-- Max People and Rent Options -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="maxPeople" class="form-label">Số lượng người tối đa <span>&nbsp;*</span></label>
          <input type="number" v-model="room.maxPeople" id="maxPeople" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.maxPeople}" placeholder="0" required/>
          <div class="invalid-feedback" v-if="errors.maxPeople">Vui lòng nhập số lượng người tối đa</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Cho thuê</label>
          <div class="form-check form-check-inline">
            <input type="checkbox" id="male" v-model="room.rentableToMale" class="form-check-input">
            <label class="form-check-label" for="male">Nam</label>
          </div>
          <div class="form-check form-check-inline">
            <input type="checkbox" id="female" v-model="room.rentableToFemale" class="form-check-input">
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Mô tả</label>
        <textarea v-model="room.description" id="description" class="form-control form-control-sm"
                  placeholder="Nhập mô tả"></textarea>
      </div>

      <!-- Image Upload -->
      <div class="mb-3">
        <label class="form-label">Hình ảnh</label>
        <input type="file" @change="onFileChange" class="form-control form-control-sm">
      </div>

      <!-- Required Fields Notice -->
      <div class="mb-4">
        <span class="text-danger">(*): Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "EditRoom",
  data() {
    return {
      room: {
        roomNumber: "",
        house: "",
        price: 0,
        length: 0,
        width: 0,
        maxPeople: 0,
        rentableToMale: false,
        rentableToFemale: false,
        description: "",
        image: null
      },
      houses: [],
      errors: {}
    };
  },
  mounted() {
    this.loadRoomData();
  },
  methods: {
    loadRoomData() {
      const storedHomes = JSON.parse(localStorage.getItem('homes')) || [];
      const roomNumber = this.$route.query.roomNumber; // Nhận roomNumber từ query
      const houseName = this.$route.query.houseName; // Nhận houseName từ query

      // Load danh sách nhà
      this.houses = storedHomes.map(home => home.name);

      // Tìm nhà và phòng tương ứng
      const currentHome = storedHomes.find(home => home.name === houseName);
      if (currentHome) {
        const room = currentHome.rooms.find(room => room.roomNumber === roomNumber);
        if (room) {
          this.room = { ...room }; // Load dữ liệu phòng
        } else {
          alert('Không tìm thấy phòng!');
          this.$router.push('/landlord/room-index');
        }
      } else {
        alert('Không tìm thấy nhà!');
        this.$router.push('/landlord/room-index');
      }
    },
    validateAndSave() {
      this.errors = {};

      // Kiểm tra các trường hợp lỗi
      if (!this.room.roomNumber) this.errors.roomNumber = true;
      if (!this.room.house) this.errors.house = true;
      if (!this.room.price || this.room.price <= 0) this.errors.price = true;
      if (!this.room.length || this.room.length <= 0) this.errors.length = true;
      if (!this.room.width || this.room.width <= 0) this.errors.width = true;
      if (!this.room.maxPeople || this.room.maxPeople <= 0) this.errors.maxPeople = true;

      // Lưu phòng nếu không có lỗi
      if (Object.keys(this.errors).length === 0) {
        this.saveRoom();
      }
    },
    saveRoom() {
      let homes = JSON.parse(localStorage.getItem('homes')) || [];

      // Tìm nhà và phòng để cập nhật
      const home = homes.find(h => h.name === this.room.house);
      if (home) {
        const index = home.rooms.findIndex(r => r.roomNumber === this.room.roomNumber);
        if (index !== -1) {
          home.rooms[index] = { ...this.room };
        }
      }

      localStorage.setItem('homes', JSON.stringify(homes));
      alert('Phòng đã được cập nhật thành công!');
      this.$router.push('/landlord/room-index');
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.room.image = e.target.result; // Store the image as base64
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style scoped>
.edit-room {
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

.form-label {
  font-weight: 500;
}

.form-select,
.form-control,
button {
  border-radius: 4px;
}

button {
  font-size: 14px;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}
</style>
