<template>
  <div class="edit-room">
    <!-- Header với H2 bên trái và các nút bên phải -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- Tiêu đề h2 -->
      <h2>Sửa Phòng</h2>

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
        <!-- Phòng số -->
        <div class="col-md-6">
          <label for="roomNumber" class="form-label">Phòng số <span class="text-danger">*</span></label>
          <input type="text" v-model="room.roomNumber" id="roomNumber" class="form-control"
                 :class="{'is-invalid': errors.roomNumber}" placeholder="Nhập số phòng" required/>
          <div class="invalid-feedback" v-if="errors.roomNumber">Vui lòng nhập số phòng</div>
        </div>

        <!-- Nhà -->
        <div class="col-md-6">
          <label for="house" class="form-label">Nhà <span class="text-danger">*</span></label>
          <select id="house" v-model="room.house" class="form-select" :class="{'is-invalid': errors.house}" required>
            <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.house">Vui lòng chọn nhà</div>
        </div>
      </div>

      <!-- Đơn giá và Kích thước -->
      <div class="row mb-3">
        <!-- Đơn giá -->
        <div class="col-md-6">
          <label for="price" class="form-label">Đơn giá <span class="text-danger">*</span></label>
          <input type="number" v-model="room.price" id="price" class="form-control"
                 :class="{'is-invalid': errors.price}" placeholder="0 VNĐ" required/>
          <div class="invalid-feedback" v-if="errors.price">Vui lòng nhập đơn giá</div>
        </div>

        <!-- Dài -->
        <div class="col-md-6">
          <label for="length" class="form-label">Dài <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="room.length" id="length" class="form-control"
                   :class="{'is-invalid': errors.length}" placeholder="0" required/>
            <span class="input-group-text">M</span>
          </div>
          <div class="invalid-feedback" v-if="errors.length">Vui lòng nhập chiều dài</div>
        </div>
      </div>

      <!-- Rộng và Số lượng người tối đa -->
      <div class="row mb-3">
        <!-- Rộng -->
        <div class="col-md-6">
          <label for="width" class="form-label">Rộng <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="room.width" id="width" class="form-control"
                   :class="{'is-invalid': errors.width}" placeholder="0" required/>
            <span class="input-group-text">M</span>
          </div>
          <div class="invalid-feedback" v-if="errors.width">Vui lòng nhập chiều rộng</div>
        </div>

        <!-- Số lượng người tối đa -->
        <div class="col-md-6">
          <label for="maxPeople" class="form-label">Số lượng người tối đa <span class="text-danger">*</span></label>
          <div class="input-group">
            <input type="number" v-model="room.maxPeople" id="maxPeople" class="form-control"
                   :class="{'is-invalid': errors.maxPeople}" placeholder="0" required/>
            <span class="input-group-text">Người</span>
          </div>
          <div class="invalid-feedback" v-if="errors.maxPeople">Vui lòng nhập số lượng người tối đa</div>
        </div>
      </div>

      <!-- Cho thuê -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="rentalStatus" class="form-label">Cho thuê</label>
          <div>
            <input type="checkbox" id="male" v-model="room.rentableToMale" class="form-check-input"/>
            <label class="form-check-label" for="male">Nam</label>

            <input type="checkbox" id="female" v-model="room.rentableToFemale" class="form-check-input ms-3"/>
            <label class="form-check-label" for="female">Nữ</label>
          </div>
        </div>
      </div>

      <!-- Mô tả thêm -->
      <div class="row mb-3">
        <div class="col-md-12">
          <label for="description" class="form-label">Mô tả thêm</label>
          <textarea v-model="room.description" id="description" class="form-control"
                    placeholder="Nhập mô tả thêm"></textarea>
        </div>
      </div>

      <!-- Hình ảnh -->
      <div class="row mb-3">
        <div class="col-md-12">
          <label class="form-label">Hình ảnh</label>
          <div class="drop-zone">
            <p>Kéo tập tin cần upload thả vào đây</p>
            <input type="file" @change="onFileChange" class="form-control"/>
          </div>
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
      houses: [], // Danh sách nhà
      errors: {} // Để lưu lỗi validate
    };
  },
  mounted() {
    const storedRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const roomNumber = this.$route.query.roomNumber;

    // Lấy danh sách nhà từ localStorage
    const storedHouses = JSON.parse(localStorage.getItem('homes')) || [];
    this.houses = storedHouses;

    // Tìm phòng dựa trên roomNumber để hiển thị
    const room = storedRooms.find(room => room.roomNumber === roomNumber);
    if (room) {
      this.room = {...room}; // Sao chép dữ liệu của phòng vào form
    } else {
      alert("Không tìm thấy phòng!");
      this.$router.push('/landlord/room-index'); // Chuyển hướng về danh sách phòng nếu không tìm thấy phòng
    }
  }
  ,
  methods: {
    validateAndSave() {
      this.errors = {}; // Xóa lỗi trước đó

      // Validate dữ liệu
      if (!this.room.roomNumber) this.errors.roomNumber = true;
      if (!this.room.house) this.errors.house = true;
      if (!this.room.price || this.room.price <= 0) this.errors.price = true;
      if (!this.room.length || this.room.length <= 0) this.errors.length = true;
      if (!this.room.width || this.room.width <= 0) this.errors.width = true;
      if (!this.room.maxPeople || this.room.maxPeople <= 0) this.errors.maxPeople = true;

      // Nếu không có lỗi, thực hiện lưu
      if (Object.keys(this.errors).length === 0) {
        this.saveRoom();
      }
    },
    saveRoom() {
      let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

      // Tìm và cập nhật phòng trong danh sách
      const index = rooms.findIndex(r => r.roomNumber === this.room.roomNumber);
      if (index !== -1) {
        rooms[index] = {...this.room};
      }

      // Lưu lại vào localStorage
      localStorage.setItem('rooms', JSON.stringify(rooms));

      alert('Phòng đã được cập nhật thành công!');
      this.$router.push('/landlord/room-index');
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.room.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style scoped>
.edit-room {
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

.form-select,
.form-control {
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
