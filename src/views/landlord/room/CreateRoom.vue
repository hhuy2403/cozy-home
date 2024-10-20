<template>
  <div class="create-room">
    <!-- Header với tiêu đề và các nút -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Thêm Phòng</h3>
      <div>
        <router-link to="/landlord/room-index">
          <button type="button" class="btn btn-warning me-2">
            <i class="fa fa-undo"></i> Quay về
          </button>
        </router-link>
        <button type="submit" class="btn btn-success" @click="validateAndSaveRoom">
          <i class="fa fa-save"></i> Lưu
        </button>
      </div>
    </div>

    <form @submit.prevent="validateAndSaveRoom">
      <!-- Số phòng và Nhà -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="roomNumber" class="form-label">Phòng số <span>*</span></label>
          <input type="text" v-model="room.roomNumber" id="roomNumber" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.roomNumber}" placeholder="Nhập số phòng" required/>
          <div class="invalid-feedback" v-if="errors.roomNumber">{{ errors.roomNumber }}</div>
        </div>
        <div class="col-md-6">
          <label for="house" class="form-label">Nhà <span>*</span></label>
          <select id="house" v-model="room.house" class="form-select form-select-sm" :class="{'is-invalid': errors.house}" required>
            <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.house">{{ errors.house }}</div>
        </div>
      </div>

      <!-- Đơn giá, Dài, Rộng -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="price" class="form-label">Đơn giá (VNĐ) <span>*</span></label>
          <input type="number" v-model="room.price" id="price" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.price}" placeholder="0 VNĐ" required/>
          <div class="invalid-feedback" v-if="errors.price">{{ errors.price }}</div>
        </div>
        <div class="col-md-4">
          <label for="length" class="form-label">Dài (M) <span>*</span></label>
          <input type="number" v-model="room.length" id="length" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.length}" placeholder="0" required/>
          <div class="invalid-feedback" v-if="errors.length">{{ errors.length }}</div>
        </div>
        <div class="col-md-4">
          <label for="width" class="form-label">Rộng (M) <span>*</span></label>
          <input type="number" v-model="room.width" id="width" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.width}" placeholder="0" required/>
          <div class="invalid-feedback" v-if="errors.width">{{ errors.width }}</div>
        </div>
      </div>

      <!-- Số lượng người tối đa và Cho thuê -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="maxPeople" class="form-label">Số lượng người tối đa <span>*</span></label>
          <input type="number" v-model="room.maxPeople" id="maxPeople" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.maxPeople}" placeholder="0" required/>
          <div class="invalid-feedback" v-if="errors.maxPeople">{{ errors.maxPeople }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Cho thuê</label>
          <div>
            <input type="checkbox" id="male" v-model="room.rentableToMale" class="form-check-input form-check-sm" />
            <label class="form-check-label" for="male">Nam</label>
            <input type="checkbox" id="female" v-model="room.rentableToFemale" class="form-check-input form-check-sm ms-3" />
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Mô tả -->
      <div class="mb-3">
        <label for="description" class="form-label">Mô tả thêm</label>
        <textarea v-model="room.description" id="description" class="form-control form-control-sm"
                  placeholder="Nhập mô tả thêm"></textarea>
      </div>

      <!-- Hình ảnh -->
      <div class="mb-3">
        <label class="form-label">Hình ảnh</label>
        <input type="file" @change="onFileChange" class="form-control form-control-sm"/>
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
  name: "CreateRoom",
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
      houses: [], // List of houses
      errors: {} // Object to store validation errors
    };
  },
  mounted() {
    // Load houses from localStorage
    const storedHouses = localStorage.getItem("homes");
    if (storedHouses) {
      this.houses = JSON.parse(storedHouses);
    }
  },
  methods: {
    validateAndSaveRoom() {
      this.errors = {}; // Clear previous errors
      const existingRooms = JSON.parse(localStorage.getItem("rooms")) || [];

      // Perform validation checks
      if (!this.room.roomNumber) {
        this.errors.roomNumber = "Vui lòng nhập số phòng.";
      } else if (existingRooms.some((room) => room.roomNumber === this.room.roomNumber && room.house === this.room.house)) {
        this.errors.roomNumber = "Phòng đã tồn tại trong nhà này.";
      }

      if (!this.room.house) this.errors.house = "Vui lòng chọn nhà.";
      if (!this.room.price || this.room.price <= 0) this.errors.price = "Đơn giá không hợp lệ.";
      if (!this.room.length || this.room.length <= 0) this.errors.length = "Chiều dài không hợp lệ.";
      if (!this.room.width || this.room.width <= 0) this.errors.width = "Chiều rộng không hợp lệ.";
      if (!this.room.maxPeople || this.room.maxPeople <= 0) this.errors.maxPeople = "Số lượng người không hợp lệ.";

      // If no errors, proceed to save
      if (Object.keys(this.errors).length === 0) {
        this.saveRoom();
      }
    },

    saveRoom() {
      // Retrieve existing rooms from localStorage, or initialize an empty array if none exists
      let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

      // Add the new room data to the array
      rooms.push(this.room);

      // Save the updated array back to localStorage
      localStorage.setItem("rooms", JSON.stringify(rooms));

      // Provide feedback or redirect after saving
      alert("Phòng đã được lưu thành công!");

      // Redirect to room index
      this.$router.push("/landlord/room-index");
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.room.image = e.target.result; // Save image as base64 data
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style scoped>
.create-room {
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

input.form-control-sm, select.form-select-sm, textarea.form-control-sm {
  font-size: 0.875rem;
}
</style>
