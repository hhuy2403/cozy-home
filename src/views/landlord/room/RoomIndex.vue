<template>
  <div class="room-index container mt-4">
    <!-- Tiêu đề -->
    <h3>Danh sách phòng</h3>

    <!-- Filters and Search -->
    <div class="row mb-4 align-items-center">
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <select class="form-select" v-model="filterStatus" :disabled="!houses.length">
          <option value="">- Trạng thái phòng -</option>
          <option value="available">Còn trống</option>
          <option value="rented">Đã cho thuê</option>
        </select>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <select class="form-select" v-model="filterFeeStatus" :disabled="!houses.length">
          <option value="">- Trạng thái phí -</option>
          <option value="unpaid">Chưa thu phí</option>
          <option value="paid">Đã thu phí</option>
        </select>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <input type="text" class="form-control" placeholder="Tìm phòng" v-model="searchQuery"
               :disabled="!houses.length"/>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-warning me-2 mb-2" @click="triggerFileUpload" :disabled="!houses.length">
        <i class="fa fa-upload"></i> Nhập phòng từ excel
      </button>
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;"/>
      <button class="btn btn-primary me-3 mb-2" :disabled="!houses.length">
        <i class="fa fa-users"></i> Khách thuê
      </button>
      <router-link to="/landlord/list-room">
        <button class="btn btn-info me-3 mb-2" :disabled="!houses.length">
          <i class="fa fa-list"></i> Phòng
        </button>
      </router-link>
      <router-link to="/landlord/create-home">
        <button class="btn btn-success mb-2">
          <i class="fa fa-building"></i> Thêm nhà
        </button>
      </router-link>
    </div>

    <!-- Thông báo nếu chưa có nhà -->
    <div v-if="!houses.length" class="alert alert-warning text-center">
      Chưa có nhà! Vui lòng thêm nhà trước khi sử dụng các dịch vụ khác.
    </div>

    <!-- House Tabs -->
    <ul v-if="houses.length" class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" v-for="(house, index) in houses" :key="index">
        <a
            class="nav-link"
            :class="{ active: activeTab === index }"
            @click="setActiveTab(index)"
            role="tab"
        >
          {{ house.name }}
        </a>
      </li>
    </ul>

    <!-- Tab Content for Houses -->
    <div v-if="houses.length" class="tab-content">
      <div
          class="tab-pane fade"
          v-for="(house, index) in filteredHouses"
          :key="index"
          :class="{ show: activeTab === index, active: activeTab === index }"
          role="tabpanel"
      >
        <div class="floor-section bg-light p-4 rounded shadow-sm">
          <!-- House Header and Room Summary -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>{{ house.name }}</h4>
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

                  <!-- Kiểm tra xem phòng đã có khách thuê hay chưa -->
                  <div v-if="room.customer && room.customer.fullName">
                    <div class="btn-group w-100 mb-3">
                      <button class="btn btn-sm btn-outline-danger" @click="releaseRoom(room.roomNumber, house.name)">
                        <i class="fa fa-sign-out-alt"></i> Trả
                      </button>
                      <button class="btn btn-sm btn-outline-warning" @click="changeRoom(room.roomNumber, house.name)">
                        <i class="fa fa-exchange-alt"></i> Đổi
                      </button>
                      <button class="btn btn-sm btn-outline-info" @click="viewCustomer(room.roomNumber, house.name)">
                        <i class="fa fa-eye"></i> Xem
                      </button>
                      <button class="btn btn-sm btn-outline-primary" @click="editCustomer(room.roomNumber, house.name)">
                        <i class="fa fa-edit"></i> Sửa
                      </button>
                    </div>
                    <p class="card-text text-success">
                      <i class="fa fa-user me-2"></i>{{ room.customer.fullName }}
                    </p>
                  </div>

                  <div v-else>
                    <!-- Nếu chưa có khách thuê, hiển thị nút Thêm khách -->
                    <button class="btn btn-sm btn-info w-100 mb-3"
                            @click="goToCreateCustomer(room.roomNumber, house.name)">
                      Thêm khách
                    </button>
                  </div>
                  <p class="card-text text-danger fw-bold">
                    <i class="fa fa-money-bill me-2"></i>{{ formatCurrency(room.price) }}
                  </p>
                  <div class="d-flex justify-content-between">
                    <router-link
                        :to="{ path: '/landlord/edit-room', query: { roomNumber: room.roomNumber, houseName: house.name } }">
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
      searchQuery: "", // Từ khóa tìm kiếm
      filterStatus: "", // Lọc trạng thái phòng
      filterFeeStatus: "", // Lọc trạng thái phí
      validationErrors: [],
      activeTab: 0 // Tab đang chọn
    };
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  computed: {
    filteredHouses() {
      let filteredHouses = this.houses.map(house => {
        return {
          ...house,
          rooms: house.rooms.slice()
        };
      });

      if (this.filterStatus || this.filterFeeStatus) {
        filteredHouses = filteredHouses.map(house => {
          let filteredRooms = house.rooms;

          if (this.filterStatus) {
            filteredRooms = filteredRooms.filter(room => {
              return this.filterStatus === 'available' ? room.isAvailable : !room.isAvailable;
            });
          }

          if (this.filterFeeStatus) {
            filteredRooms = filteredRooms.filter(room => {
              return this.filterFeeStatus === 'unpaid' ? room.isUnpaid : !room.isUnpaid;
            });
          }

          return {...house, rooms: filteredRooms};
        });
      }

      if (this.searchQuery.trim()) {
        filteredHouses = filteredHouses.map(house => {
          return {
            ...house,
            rooms: house.rooms.filter(room =>
                room.roomNumber.toString().includes(this.searchQuery.trim())
            )
          };
        });
      }

      return filteredHouses;
    }
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

        this.houses.forEach((house) => {
          house.rooms = this.rooms.filter((room) => room.house === house.name);

          house.rooms.forEach((room) => {
            const roomKey = `${house.name}_room_${room.roomNumber}`;
            const roomData = localStorage.getItem(roomKey);

            if (roomData) {
              const roomDetails = JSON.parse(roomData);
              room.customer = roomDetails.customer || null;
              room.isAvailable = !room.customer;  // Phòng trống nếu không có khách
              room.isUnpaid = true;  // Bạn có thể thay đổi logic nếu cần
            } else {
              room.customer = null;
              room.isAvailable = true;  // Không có khách nên phòng trống
            }
          });
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
          rentableToMale: room['Cho thuê Nam'] === 'Yes',
          rentableToFemale: room['Cho thuê Nữ'] === 'Yes',
          order: room['Thứ tự'],
          isAvailable: true,
          isUnpaid: true
        };

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
    setActiveTab(index) {
      this.activeTab = index;
      this.searchQuery = "";
    },
    goToCreateCustomer(roomNumber, houseName) {
      this.$router.push({
        path: '/landlord/create-customer',
        query: {
          roomNumber: roomNumber,
          houseName: houseName
        }
      });
    },
    releaseRoom(roomNumber, houseName) {
      let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
      const room = rooms.find(r => r.roomNumber === roomNumber && r.house === houseName);

      if (room) {
        room.customer = null;
        localStorage.setItem('rooms', JSON.stringify(rooms));
        this.loadDataFromLocalStorage();
        alert(`Khách đã trả phòng ${roomNumber} thành công.`);
      }
    },
    changeRoom(roomNumber, houseName) {
      alert(`Khách thuê phòng ${roomNumber} trong nhà ${houseName} muốn đổi phòng.`);
    },
    viewCustomer(roomNumber, houseName) {
      alert(`Xem thông tin khách thuê phòng ${roomNumber} trong nhà ${houseName}`);
    },
    editCustomer(roomNumber, houseName) {
      this.$router.push({
        path: '/landlord/edit-customer',
        query: {roomNumber: roomNumber, houseName: houseName}
      });
    },
    availableRooms(houseName) {
      const roomsInHouse = this.rooms.filter((room) => room.house === houseName);
      return roomsInHouse.filter(room => room.isAvailable).length;
    },

    rentedRooms(houseName) {
      const roomsInHouse = this.rooms.filter((room) => room.house === houseName);
      return roomsInHouse.filter(room => !room.isAvailable).length;
    },

    unpaidRooms(houseName) {
      const roomsInHouse = this.rooms.filter((room) => room.house === houseName);
      return roomsInHouse.filter(room => room.isUnpaid).length;
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
h3 {
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  color: #2a3f54;
}

.mt-4 {
  margin-top: 3em !important;
}

.floor-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card.room-card {
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
