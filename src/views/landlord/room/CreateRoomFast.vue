<template>
  <div class="create-room-fast">
    <!-- Header với H2 bên trái và các nút bên phải -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Thêm Phòng Nhanh</h2>
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
        <!-- Từ phòng -->
        <div class="col-md-6">
          <label for="startRoomNumber" class="form-label">Từ phòng <span class="text-danger">*</span></label>
          <input type="number" v-model="startRoomNumber" id="startRoomNumber" class="form-control"
                 :class="{'is-invalid': errors.startRoomNumber}" placeholder="Nhập số phòng bắt đầu" required />
          <div class="invalid-feedback" v-if="errors.startRoomNumber">{{ errors.startRoomNumber }}</div>
        </div>

        <!-- Đến phòng -->
        <div class="col-md-6">
          <label for="endRoomNumber" class="form-label">Đến phòng <span class="text-danger">*</span></label>
          <input type="number" v-model="endRoomNumber" id="endRoomNumber" class="form-control"
                 :class="{'is-invalid': errors.endRoomNumber}" placeholder="Nhập số phòng kết thúc" required />
          <div class="invalid-feedback" v-if="errors.endRoomNumber">{{ errors.endRoomNumber }}</div>
        </div>
      </div>

      <!-- Nhà -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="house" class="form-label">Nhà <span class="text-danger">*</span></label>
          <select id="house" v-model="house" class="form-select" :class="{'is-invalid': errors.house}" required>
            <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.house">Vui lòng chọn nhà.</div>
        </div>
      </div>

      <!-- Đơn giá, Dài, Rộng -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="price" class="form-label">Đơn giá <span class="text-danger">*</span></label>
          <input type="number" v-model="price" id="price" class="form-control" :class="{'is-invalid': errors.price}" placeholder="0 VNĐ" required />
          <div class="invalid-feedback" v-if="errors.price">Vui lòng nhập đơn giá hợp lệ.</div>
        </div>
        <div class="col-md-6">
          <label for="length" class="form-label">Dài <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="length" id="length" class="form-control" :class="{'is-invalid': errors.length}" placeholder="0" required />
            <span class="input-group-text">M</span>
            <div class="invalid-feedback" v-if="errors.length">Vui lòng nhập chiều dài hợp lệ.</div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <!-- Rộng -->
        <div class="col-md-6">
          <label for="width" class="form-label">Rộng <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="width" id="width" class="form-control" :class="{'is-invalid': errors.width}" placeholder="0" required />
            <span class="input-group-text">M</span>
            <div class="invalid-feedback" v-if="errors.width">Vui lòng nhập chiều rộng hợp lệ.</div>
          </div>
        </div>

        <!-- Số lượng người tối đa -->
        <div class="col-md-6">
          <label for="maxPeople" class="form-label">Số lượng người tối đa <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="maxPeople" id="maxPeople" class="form-control" :class="{'is-invalid': errors.maxPeople}" placeholder="0" required />
            <span class="input-group-text">Người</span>
            <div class="invalid-feedback" v-if="errors.maxPeople">Vui lòng nhập số người hợp lệ.</div>
          </div>
        </div>
      </div>

      <!-- Cho thuê -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="rentalStatus" class="form-label">Cho thuê</label>
          <div>
            <input type="checkbox" id="male" v-model="rentableToMale" class="form-check-input" />
            <label class="form-check-label" for="male">Nam</label>

            <input type="checkbox" id="female" v-model="rentableToFemale" class="form-check-input ms-3" />
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Mô tả thêm -->
      <div class="row mb-3">
        <div class="col-md-12">
          <label for="description" class="form-label">Mô tả thêm</label>
          <textarea v-model="description" id="description" class="form-control" placeholder="Nhập mô tả thêm"></textarea>
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
  name: "CreateRoomFast",
  data() {
    return {
      startRoomNumber: null,
      endRoomNumber: null,
      house: "",
      price: 0,
      length: 0,
      width: 0,
      maxPeople: 0,
      rentableToMale: false,
      rentableToFemale: false,
      description: "",
      houses: [],
      existingRooms: [], // To store existing rooms
      errors: {} // To store validation errors
    };
  },
  mounted() {
    // Fetch house and room data from localStorage
    const storedHouses = localStorage.getItem("homes");
    const storedRooms = localStorage.getItem("rooms");

    if (storedHouses) {
      this.houses = JSON.parse(storedHouses);
    }

    if (storedRooms) {
      this.existingRooms = JSON.parse(storedRooms); // Fetch all rooms for validation
    }
  },
  methods: {
    validateAndSave() {
      this.errors = {}; // Reset errors

      // Validation logic
      if (!this.startRoomNumber || !this.endRoomNumber || this.startRoomNumber > this.endRoomNumber) {
        this.errors.startRoomNumber = "Số phòng bắt đầu phải nhỏ hơn hoặc bằng số phòng kết thúc.";
        return;
      }

      if (!this.house) {
        this.errors.house = "Vui lòng chọn nhà.";
      }
      if (!this.price || this.price <= 0) {
        this.errors.price = "Vui lòng nhập đơn giá hợp lệ.";
      }
      if (!this.length || this.length <= 0) {
        this.errors.length = "Vui lòng nhập chiều dài hợp lệ.";
      }
      if (!this.width || this.width <= 0) {
        this.errors.width = "Vui lòng nhập chiều rộng hợp lệ.";
      }
      if (!this.maxPeople || this.maxPeople <= 0) {
        this.errors.maxPeople = "Vui lòng nhập số người hợp lệ.";
      }

      // Check if room number already exists
      for (let roomNumber = this.startRoomNumber; roomNumber <= this.endRoomNumber; roomNumber++) {
        const roomExists = this.existingRooms.some(
            (room) => room.roomNumber === roomNumber.toString() && room.house === this.house
        );
        if (roomExists) {
          this.errors.roomExists = `Phòng số ${roomNumber} đã tồn tại trong ${this.house}.`;
          alert(this.errors.roomExists);
          return;
        }
      }

      // Nếu không có lỗi, thực hiện lưu các phòng
      if (Object.keys(this.errors).length === 0) {
        this.saveRooms();
      }
    },

    saveRooms() {
      // Lấy danh sách các phòng từ localStorage
      let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

      // Tạo phòng từ số phòng bắt đầu đến số phòng kết thúc
      for (let roomNumber = this.startRoomNumber; roomNumber <= this.endRoomNumber; roomNumber++) {
        const room = {
          roomNumber: roomNumber.toString(),
          house: this.house,
          price: this.price,
          length: this.length,
          width: this.width,
          maxPeople: this.maxPeople,
          rentableToMale: this.rentableToMale,
          rentableToFemale: this.rentableToFemale,
          description: this.description
        };

        // Thêm phòng vào mảng
        rooms.push(room);
      }

      // Lưu danh sách phòng đã cập nhật vào localStorage
      localStorage.setItem("rooms", JSON.stringify(rooms));

      alert("Các phòng đã được lưu thành công!");
      this.$router.push("/landlord/room-index");
    }
  }
};
</script>

<style scoped>
.create-room-fast {
  margin-top: 30px;
  padding: 20px;
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
