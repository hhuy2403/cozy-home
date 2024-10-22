<template>
  <div class="create-room-fast">
    <!-- Header với tiêu đề và các nút -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Thêm Phòng Nhanh</h3>
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
      <!-- Từ phòng và Đến phòng -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="startRoomNumber" class="form-label">Từ phòng <span>&nbsp;*</span></label>
          <input type="number" v-model="startRoomNumber" id="startRoomNumber" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.startRoomNumber}" placeholder="Nhập số phòng bắt đầu" required />
          <div class="invalid-feedback" v-if="errors.startRoomNumber">{{ errors.startRoomNumber }}</div>
        </div>
        <div class="col-md-6">
          <label for="endRoomNumber" class="form-label">Đến phòng <span>&nbsp;*</span></label>
          <input type="number" v-model="endRoomNumber" id="endRoomNumber" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.endRoomNumber}" placeholder="Nhập số phòng kết thúc" required />
          <div class="invalid-feedback" v-if="errors.endRoomNumber">{{ errors.endRoomNumber }}</div>
        </div>
      </div>

      <!-- Nhà -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="house" class="form-label">Nhà <span>&nbsp;*</span></label>
          <select id="house" v-model="house" class="form-select form-select-sm" :class="{'is-invalid': errors.house}" required>
            <option v-for="house in houses" :key="house.id" :value="house.id">{{ house.name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.house">Vui lòng chọn nhà.</div>
        </div>
      </div>

      <!-- Đơn giá, Dài, Rộng -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label for="price" class="form-label">Đơn giá (VNĐ) <span>&nbsp;*</span></label>
          <input type="number" v-model="price" id="price" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.price}" placeholder="0 VNĐ" required />
          <div class="invalid-feedback" v-if="errors.price">Vui lòng nhập đơn giá hợp lệ.</div>
        </div>
        <div class="col-md-4">
          <label for="length" class="form-label">Dài (M) <span>&nbsp;*</span></label>
          <input type="number" v-model="length" id="length" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.length}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.length">Vui lòng nhập chiều dài hợp lệ.</div>
        </div>
        <div class="col-md-4">
          <label for="width" class="form-label">Rộng (M) <span>&nbsp;*</span></label>
          <input type="number" v-model="width" id="width" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.width}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.width">Vui lòng nhập chiều rộng hợp lệ.</div>
        </div>
      </div>

      <!-- Số lượng người tối đa và Cho thuê -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="maxPeople" class="form-label">Số lượng người tối đa <span>&nbsp;*</span></label>
          <input type="number" v-model="maxPeople" id="maxPeople" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.maxPeople}" placeholder="0" required />
          <div class="invalid-feedback" v-if="errors.maxPeople">Vui lòng nhập số người hợp lệ.</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Cho thuê</label>
          <div>
            <input type="checkbox" id="male" v-model="rentableToMale" class="form-check-input form-check-sm" />
            <label class="form-check-label" for="male">Nam</label>

            <input type="checkbox" id="female" v-model="rentableToFemale" class="form-check-input form-check-sm ms-3" />
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Mô tả -->
      <div class="mb-3">
        <label for="description" class="form-label">Mô tả thêm</label>
        <textarea v-model="description" id="description" class="form-control form-control-sm"
                  placeholder="Nhập mô tả"></textarea>
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
      errors: {} // Để lưu lỗi validate
    };
  },
  mounted() {
    this.loadHouses(); // Load danh sách nhà từ localStorage
    const houseName = this.$route.query.houseName; // Lấy houseName từ query
    if (houseName) {
      const house = this.houses.find(h => h.name === houseName);
      if (house) {
        this.house = house.id; // Gán giá trị house vào form
      }
    }
  },
  methods: {
    loadHouses() {
      // Load danh sách nhà từ localStorage
      const storedHouses = localStorage.getItem("homes");
      if (storedHouses) {
        this.houses = JSON.parse(storedHouses);
      }
    },
    validateAndSave() {
      this.errors = {}; // Reset lỗi

      // Logic kiểm tra hợp lệ
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

      // Kiểm tra trùng lặp số phòng
      const existingRooms = this.getAllRooms(); // Lấy tất cả các phòng hiện có
      for (let roomNumber = this.startRoomNumber; roomNumber <= this.endRoomNumber; roomNumber++) {
        const roomExists = existingRooms.some(
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

    getAllRooms() {
      // Lấy tất cả các phòng trong tất cả các nhà
      const homes = JSON.parse(localStorage.getItem("homes")) || [];
      return homes.flatMap(home => home.rooms || []);
    },

    saveRooms() {
      // Lấy danh sách các phòng từ localStorage
      let homes = JSON.parse(localStorage.getItem("homes")) || [];
      const homeIndex = homes.findIndex(house => house.id === this.house);

      if (homeIndex !== -1) {
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

          // Thêm phòng vào mảng rooms của nhà
          homes[homeIndex].rooms.push(room);
        }

        // Lưu danh sách phòng đã cập nhật vào localStorage
        localStorage.setItem("homes", JSON.stringify(homes));

        alert("Các phòng đã được lưu thành công!");
        this.$router.push("/landlord/room-index");
      } else {
        alert("Không tìm thấy nhà đã chọn.");
      }
    }
  }
};
</script>

<style scoped>
.create-room-fast {
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
