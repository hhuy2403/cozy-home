<template>
  <div class="room-index">

    <!-- Filters and Search -->
    <div class="row mb-4 align-items-center">
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <select class="form-select">
          <option value="" disabled selected>- Trạng thái phòng -</option>
        </select>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <select class="form-select">
          <option value="" disabled selected>- Trạng thái phí -</option>
        </select>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <input type="text" class="form-control" placeholder="Tìm phòng"/>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <button class="btn btn-primary w-100">
          <i class="fa fa-search"></i> Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Action Buttons Row -->
    <div class="d-flex justify-content-end mb-4 action-buttons">
      <button class="btn btn-warning me-2 mb-2" @click="triggerFileUpload">
        <i class="fa fa-upload"></i> Nhập phòng từ excel
      </button>
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
      <button class="btn btn-primary me-3 mb-2">
        <i class="fa fa-users"></i> Khách thuê
      </button>
      <router-link to="/landlord/list-room">
        <button class="btn btn-info me-3 mb-2">
          <i class="fa fa-list"></i> Phòng
        </button>
      </router-link>
      <router-link to="/landlord/create-home">
        <button class="btn btn-success mb-2">
          <i class="fa fa-building"></i> Thêm nhà
        </button>
      </router-link>
    </div>

    <!-- House Tabs -->
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" v-for="(house, index) in houses" :key="index">
        <a
            class="nav-link"
            :class="{ active: index === 0 }"
            :id="'house-tab-' + index"
            data-bs-toggle="tab"
            :href="'#house-' + index"
            role="tab"
            :aria-controls="'house-' + index"
            :aria-selected="index === 0"
        >
          {{ house.name }}
        </a>
      </li>
    </ul>

    <!-- Tab Content for Houses -->
    <div class="tab-content">
      <div
          class="tab-pane fade"
          v-for="(house, index) in houses"
          :key="index"
          :class="{ show: index === 0, active: index === 0 }"
          :id="'house-' + index"
          role="tabpanel"
      >
        <div class="floor-section bg-light p-4 rounded shadow-sm">
          <!-- House Header and Room Summary -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold text-primary">{{ house.name }}</h4>
            <span class="status-summary">
              Còn trống {{ availableRooms(house.name) }} | Đã cho thuê {{
                rentedRooms(house.name)
              }} | Chưa thu phí {{ unpaidRooms(house.name) }}
            </span>
          </div>

          <!-- Action Buttons for Managing Rooms -->
          <div class="mb-3 d-flex flex-wrap">
            <router-link :to="{ path: '/landlord/create-room-fast', query: { house: house.name } }">
              <button class="btn btn-outline-info me-2 mb-2">
                <i class="fa fa-plus"></i> Thêm phòng nhanh
              </button>
            </router-link>
            <router-link :to="{ path: '/landlord/create-room', query: { house: house.name } }">
              <button class="btn btn-outline-success me-2 mb-2">
                <i class="fa fa-bed"></i> Thêm phòng
              </button>
            </router-link>

            <router-link :to="{ path: '/landlord/edit-home', query: { house: house.name } }">
              <button class="btn btn-outline-primary me-2 mb-2">
                <i class="fa fa-pencil-alt"></i> Sửa nhà
              </button>
            </router-link>

            <button class="btn btn-outline-danger mb-2" @click="deleteHouse(house.name)">
              <i class="fa fa-times"></i> Xóa nhà
            </button>
          </div>

          <!-- Room Cards for Current House -->
          <div class="row" v-if="house.rooms && house.rooms.length">
            <div class="col-md-3 col-sm-6 mb-4" v-for="(room, index) in house.rooms" :key="index">
              <div class="card room-card border-0 shadow-sm h-100">
                <div class="card-body">
                  <h5 class="card-title text-primary d-flex align-items-center">
                    <i class="fa fa-home me-2"></i> {{ room.roomNumber }}
                  </h5>
                  <button class="btn btn-sm btn-info w-100 mb-3">Thêm khách</button>
                  <p class="card-text text-danger fw-bold">
                    <i class="fa fa-money-bill me-2"></i>{{ formatCurrency(room.price) }}
                  </p>
                  <div class="d-flex justify-content-between">
                    <router-link
                        :to="{ path: '/landlord/edit-room', query: { roomNumber: room.roomNumber, houseName: house.name } }"
                    >
                      <button class="btn btn-sm btn-outline-primary">
                        <i class="fa fa-edit"></i> Chỉnh sửa
                      </button>
                    </router-link>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteRoom(room.roomNumber, house.name)">
                      <i class="fa fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-else>Chưa có phòng nào trong nhà này</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: "RoomIndex",
  data() {
    return {
      houses: [],
      rooms: [],
      validationErrors: []
    };
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHouses = localStorage.getItem("homes");
      const storedRooms = localStorage.getItem("rooms");

      if (storedHouses) {
        this.houses = JSON.parse(storedHouses);
      }

      if (storedRooms) {
        this.rooms = JSON.parse(storedRooms);

        // Gắn phòng vào các nhà tương ứng
        this.houses.forEach((house) => {
          house.rooms = this.rooms.filter((room) => room.house === house.name);
        });
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        this.importRoomsFromExcel(jsonData);
      };

      reader.readAsArrayBuffer(file);
    },
    importRoomsFromExcel(excelData) {
      this.validationErrors = [];

      excelData.forEach((room) => {
        const newRoom = {
          roomNumber: room['Tên phòng'],
          house: room['Khu vực'],
          price: room['Đơn giá'],
          length: room['Dài'],
          width: room['Rộng'],
          maxPeople: room['Số lượng người tối đa'],
          description: room['Mô tả'],
          rentableToMale: room['Cho thuê Nam'] === 'Yes' ? true : false,
          rentableToFemale: room['Cho thuê Nữ'] === 'Yes' ? true : false,
          order: room['Thứ tự']
        };

        // Kiểm tra hợp lệ
        const houseExists = this.houses.some(h => h.name === newRoom.house);
        if (!houseExists) {
          this.validationErrors.push(`Nhà "${newRoom.house}" không tồn tại.`);
          return;
        }

        const roomExists = this.rooms.some(
            (r) => r.roomNumber === newRoom.roomNumber && r.house === newRoom.house
        );
        if (roomExists) {
          this.validationErrors.push(
              `Phòng "${newRoom.roomNumber}" đã tồn tại trong nhà "${newRoom.house}".`
          );
          return;
        }

        // Validate giá trị số
        if (isNaN(newRoom.price) || newRoom.price <= 0) {
          this.validationErrors.push(`Đơn giá của phòng "${newRoom.roomNumber}" không hợp lệ.`);
          return;
        }
        if (isNaN(newRoom.length) || newRoom.length <= 0) {
          this.validationErrors.push(`Dài của phòng "${newRoom.roomNumber}" không hợp lệ.`);
          return;
        }
        if (isNaN(newRoom.width) || newRoom.width <= 0) {
          this.validationErrors.push(`Rộng của phòng "${newRoom.roomNumber}" không hợp lệ.`);
          return;
        }
        if (isNaN(newRoom.order) || newRoom.order <= 0) {
          this.validationErrors.push(`Thứ tự của phòng "${newRoom.roomNumber}" không hợp lệ.`);
          return;
        }

        this.rooms.push(newRoom);
      });

      if (this.validationErrors.length === 0) {
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
        alert('Nhập phòng từ file Excel thành công!');
        this.loadDataFromLocalStorage();
      } else {
        alert('Có lỗi xảy ra khi nhập phòng từ Excel:\n' + this.validationErrors.join('\n'));
      }
    },
    availableRooms(houseName) {
      const roomsInHouse = this.rooms.filter((room) => room.house === houseName);
      return roomsInHouse.length;
    },
    rentedRooms() {
      return 0;
    },
    unpaidRooms() {
      return 0;
    },
    formatCurrency(value) {
      if (!value) return "0 VNĐ";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value);
    },
    deleteHouse(houseName) {
      let homes = JSON.parse(localStorage.getItem('homes')) || [];
      homes = homes.filter(home => home.name !== houseName);
      localStorage.setItem('homes', JSON.stringify(homes));
      this.houses = homes;
      alert(`Nhà ${houseName} đã được xóa thành công!`);
      window.location.reload();
    },
    deleteRoom(roomNumber, houseName) {
      let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
      rooms = rooms.filter(room => room.roomNumber !== roomNumber || room.house !== houseName);
      localStorage.setItem('rooms', JSON.stringify(rooms));
      this.rooms = rooms;

      this.houses.forEach((house) => {
        if (house.name === houseName) {
          house.rooms = this.rooms.filter((room) => room.house === house.name);
        }
      });

      alert(`Phòng ${roomNumber} trong ${houseName} đã được xóa thành công!`);
    }
  }
};
</script>

<style scoped>
/* Styling */
.btn {
  padding: 10px 20px !important;
  font-size: 14px;
  border-radius: 5px !important;
}

.room-index {
  margin-top: 30px;
  padding: 20px;
}

.action-buttons button {
  min-width: 150px;
}

.status-summary {
  font-size: 16px;
  color: #555;
}

.floor-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.card.room-card {
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary,
.btn-outline-success,
.btn-outline-info,
.btn-outline-danger {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-outline-primary:hover,
.btn-outline-success:hover,
.btn-outline-info:hover,
.btn-outline-danger:hover {
  color: #fff;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.card-text {
  font-size: 16px;
}
</style>
