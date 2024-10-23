<template>
  <div class="room-index container mt-4">
    <!-- Title and Filters -->
    <h3>Danh sách phòng</h3>
    <div class="row mb-4 align-items-center">
      <div class="col-lg-3 col-md-3 col-sm-6 mb-2">
        <select class="form-select" v-model="filterStatus">
          <option value="">- Trạng thái phòng -</option>
          <option value="available">Còn trống</option>
          <option value="rented">Đã cho thuê</option>
        </select>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 mb-2">
        <select class="form-select" v-model="filterFeeStatus">
          <option value="">- Trạng thái phí -</option>
          <option value="unpaid">Chưa thu phí</option>
          <option value="paid">Đã thu phí</option>
        </select>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 mb-2">
        <input type="text" class="form-control" placeholder="Phòng" v-model="searchQuery"/>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-6 mb-2">
        <button class="btn btn-primary w-100" @click="searchRooms"><i class="fas fa-search"></i> Tìm kiếm</button>
      </div>
      <div class="d-flex justify-content-start">
        <span>Còn trống: {{ availableRooms }} | Đã cho thuê: {{ rentedRooms }} | Chưa thu phí: {{ unpaidRooms }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-warning me-2 mb-2"><i class="fa fa-upload"></i> Nhập phòng từ excel</button>
      <router-link to="/landlord/customer">
        <button class="btn btn-primary me-2 mb-2"><i class="fa fa-users"></i> Khách thuê</button>
      </router-link>
      <router-link to="/landlord/list-room">
        <button class="btn btn-info me-2 mb-2"><i class="fa fa-list"></i> Phòng</button>
      </router-link>
      <router-link to="/landlord/create-home">
        <button class="btn btn-success mb-2"><i class="fa fa-building"></i> Thêm nhà</button>
      </router-link>
    </div>

    <!-- Tabs for Houses -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="(house, index) in houses" :key="index">
        <a class="nav-link" :class="{ active: activeTab === index }" @click="setActiveTab(index)">
          {{ house.name }}
        </a>
      </li>
    </ul>

    <!-- Room Cards -->
    <div class="tab-content">
      <div v-for="(house, index) in filteredHouses" :key="index" class="tab-pane fade" :class="{ show: activeTab === index, active: activeTab === index }">
        <div class="d-flex justify-content-between mb-3">
          <span>
            Còn trống: {{ availableRoomsInHouse(house) }} | Đã cho thuê: {{ rentedRoomsInHouse(house) }} | Chưa thu phí: {{ unpaidRoomsInHouse(house) }}
          </span>
          <div>
            <router-link :to="{ path: '/landlord/create-room-fast', query: { houseName: house.name } }">
              <button class="btn btn-outline-info me-2"><i class="fa fa-plus"></i> Thêm phòng nhanh</button>
            </router-link>
            <router-link :to="{ path: '/landlord/create-room', query: { houseName: house.name } }">
              <button class="btn btn-outline-success me-2"><i class="fa fa-bed"></i> Thêm phòng</button>
            </router-link>
            <router-link :to="{ path: '/landlord/edit-home', query: { houseName: house.name } }">
              <button class="btn btn-outline-primary me-2"><i class="fa fa-pencil-alt"></i> Sửa nhà</button>
            </router-link>
            <button class="btn btn-outline-danger" @click="deleteHouse(house)"><i class="fa fa-times"></i> Xóa nhà</button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3 col-sm-6 mb-4" v-for="room in house.rooms" :key="room.roomNumber">
            <div class="card room-card h-100">
              <div class="card-body">
                <h5 class="card-title d-flex align-items-center">
                  <i class="fa fa-home me-2"></i> Phòng {{ room.roomNumber }}
                </h5>
                <div v-if="room.customer">
                  <div class="btn-group w-90 mb-3">
                    <button class="btn btn-sm btn-outline-success" @click="checkoutRoom(room, house.name)"><i class="fa fa-undo"></i></button>&nbsp;
                    <button class="btn btn-sm btn-outline-warning"><i class="fa fa-exchange-alt"></i></button>
                    <router-link
                        :to="{
                        path: '/landlord/create-customer',
                        query: {
                          roomNumber: room.roomNumber,
                          houseName: house.name,
                          viewOnly: true
                        }
                      }"
                    >
                      <button class="btn btn-sm btn-outline-info"><i class="fa fa-eye"></i></button>
                    </router-link>
                    <router-link
                        :to="{
                        path: '/landlord/create-customer',
                        query: {
                          roomNumber: room.roomNumber,
                          houseName: house.name,
                          editMode: true
                        }
                      }"
                    >
                      <button class="btn btn-sm btn-outline-primary"><i class="fa fa-edit"></i></button>
                    </router-link>
                  </div>
                   <p class="text-success"><i class="fas fa-user"></i> {{ room.customer.fullName }}</p>
                </div>
                <div v-else>
                  <router-link
                      :to="{
                      path: '/landlord/create-customer',
                      query: {
                        roomNumber: room.roomNumber,
                        houseName: house.name,
                        price: room.price
                      }
                    }"
                  >
                    <button class="btn btn-info w-100 mb-3">Thêm khách</button>
                  </router-link>

                </div>
                <p><i class="fa fa-money-bill"></i> {{ formatCurrency(room.price) }}</p>
                <div class="d-flex justify-content-between">
                  <router-link :to="{ path: '/landlord/edit-room', query: { roomNumber: room.roomNumber, houseName: house.name } }">
                    <button class="btn btn-sm btn-outline-primary"><i class="fa fa-edit"></i> Chỉnh sửa</button>
                  </router-link>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteRoom(room, house.name)"><i class="fa fa-trash"></i> Xóa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houses: [],
      filterStatus: '',
      filterFeeStatus: '',
      searchQuery: '',
      activeTab: 0,
    };
  },
  computed: {
    filteredHouses() {
      // Filter houses based on status, fee, and search query
      let houses = [...this.houses];
      if (this.filterStatus) {
        houses = houses.map(house => ({
          ...house,
          rooms: house.rooms.filter(room => (this.filterStatus === 'available' ? !room.customer : room.customer)),
        }));
      }
      if (this.filterFeeStatus) {
        houses = houses.map(house => ({
          ...house,
          rooms: house.rooms.filter(room => (this.filterFeeStatus === 'unpaid' ? !room.isPaid : room.isPaid)),
        }));
      }
      if (this.searchQuery) {
        houses = houses.map(house => ({
          ...house,
          rooms: house.rooms.filter(room => room.roomNumber.toString().includes(this.searchQuery)),
        }));
      }
      return houses;
    },
    availableRooms() {
      return this.houses.reduce((total, house) => total + house.rooms.filter(room => !room.customer).length, 0);
    },
    rentedRooms() {
      return this.houses.reduce((total, house) => total + house.rooms.filter(room => room.customer).length, 0);
    },
    unpaidRooms() {
      return this.houses.reduce((total, house) => total + house.rooms.filter(room => !room.isPaid).length, 0);
    },
  },
  methods: {
    setActiveTab(index) {
      this.activeTab = index;
    },
    checkoutRoom(room, houseName) {
      const checkoutDate = prompt("Nhập ngày trả phòng (yyyy-mm-dd):");
      if (!checkoutDate) {
        alert("Vui lòng nhập ngày trả phòng hợp lệ.");
        return;
      }

      const isPaid = confirm("Khách đã thanh toán toàn bộ chi phí cuối tháng chưa?");

      if (isPaid) {
        let homes = JSON.parse(localStorage.getItem('homes')) || [];
        const home = homes.find(h => h.name === houseName);

        if (home) {
          const currentRoom = home.rooms.find(r => r.roomNumber === room.roomNumber);

          if (currentRoom) {
            currentRoom.customer = null;
            currentRoom.services = [];
            currentRoom.members = [];
            currentRoom.contract = [];
            currentRoom.electricData = [];
            currentRoom.waterData = [];
            currentRoom.isPaid = false;
            currentRoom.isRented = false;
            currentRoom.bookings = [];

            localStorage.setItem('homes', JSON.stringify(homes));

            alert(`Phòng ${room.roomNumber} đã được trả và cập nhật thành phòng trống!`);
            this.houses = homes;
          }
        } else {
          alert("Không tìm thấy nhà hoặc phòng!");
        }
      } else {
        alert("Vui lòng thanh toán toàn bộ chi phí trước khi trả phòng.");
      }
    },
    availableRoomsInHouse(house) {
      return house.rooms.filter(room => !room.customer).length;
    },
    rentedRoomsInHouse(house) {
      return house.rooms.filter(room => room.customer).length;
    },
    unpaidRoomsInHouse(house) {
      return house.rooms.filter(room => !room.isPaid).length;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
    searchRooms() {
    },
    deleteRoom(room, houseName) {
      const confirmation = confirm(`Bạn có chắc chắn muốn xóa phòng ${room.roomNumber} thuộc nhà ${houseName}?`);
      if (confirmation) {
        let homes = JSON.parse(localStorage.getItem('homes')) || [];
        const home = homes.find(h => h.name === houseName);

        if (home) {
          home.rooms = home.rooms.filter(r => r.roomNumber !== room.roomNumber);
          localStorage.setItem('homes', JSON.stringify(homes));
          alert(`Phòng ${room.roomNumber} đã được xóa!`);
          this.houses = homes;
        }
      }
    },
    deleteHouse(house) {
      const confirmation = confirm(`Bạn có chắc chắn muốn xóa toàn bộ nhà ${house.name}?`);
      if (confirmation) {
        let homes = JSON.parse(localStorage.getItem('homes')) || [];
        homes = homes.filter(h => h.name !== house.name);
        localStorage.setItem('homes', JSON.stringify(homes));
        alert(`Nhà ${house.name} đã được xóa!`);
        this.houses = homes;
      }
    },
  },
  mounted() {
    this.houses = JSON.parse(localStorage.getItem('homes')) || [];
  },
};
</script>

<style scoped>
.mt-4 {
  margin-top: 3em !important;
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

.nav-tabs .nav-link {
  padding: 10px 15px;
}

.room-card {
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
}

.btn-group .btn {
  flex-grow: 1;
}

.text-success {
  font-weight: bold;
  font-size: 16px;
}
</style>
