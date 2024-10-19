<template>
  <div class="room-management">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="header d-flex justify-content-between align-items-center py-3">
        <h2 class="page-title">Quản lý phòng</h2>
        <div class="header-actions">
          <button class="btn btn-warning" @click="importRooms">
            <i class="fas fa-upload"></i> Nhập từ Excel
          </button>
          <a href="" class="btn btn-primary">
            <i class="fas fa-users"></i> Khách thuê
          </a>
          <a href="" class="btn btn-primary">
            <i class="fas fa-bed"></i> Phòng
          </a>
          <a href="javascript:void(0)" class="btn btn-success" @click="addHouse">
            <i class="fas fa-building"></i> Thêm nhà
          </a>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filters-section bg-white p-4 shadow-sm rounded mb-4">
        <div class="d-flex align-items-center">
          <div class="form-group mr-3">
            <label for="roomStatusFilter">Trạng thái phòng</label>
            <select class="form-control" v-model="selectedRoomStatus" @change="filterRooms">
              <option value="">- Trạng thái phòng -</option>
              <option value="Còn trống">Còn trống</option>
              <option value="Đã cho thuê">Đã cho thuê</option>
            </select>
          </div>

          <div class="form-group mr-3">
            <label for="feeStatusFilter">Trạng thái phí</label>
            <select class="form-control" v-model="selectedFeeStatus" @change="filterRooms">
              <option value="">- Trạng thái phí -</option>
              <option value="Chưa thu phí">Chưa thu phí</option>
              <option value="Đã thu phí">Đã thu phí</option>
            </select>
          </div>

          <div class="form-group mr-3">
            <label for="roomSearch">Tìm kiếm phòng</label>
            <input
                type="text"
                class="form-control"
                v-model="roomSearch"
                placeholder="Nhập tên phòng"
                @input="filterRooms"
            />
          </div>

          <button class="btn btn-primary align-self-end" @click="filterRooms">
            <i class="fas fa-search"></i> Tìm kiếm
          </button>
        </div>
      </div>

      <!-- room Status Summary -->
      <div class="status-summary bg-light p-3 rounded mb-4">
        <p class="m-0">
          Còn trống: <strong>{{ vacantRooms.length }}</strong> |
          Đã cho thuê: <strong>{{ rentedRooms.length }}</strong> |
          Chưa thu phí: <strong>{{ unpaidFees }}</strong> |
          Nhà: <strong>{{ activeHouseName }}</strong>
        </p>
      </div>

      <!-- House Tabs -->
      <ul class="nav nav-tabs house-tabs mb-4">
        <li v-for="house in houses" :key="house.id" class="nav-item">
          <a
              class="nav-link"
              :class="{ active: activeHouse === house.id }"
              @click="setActiveHouse(house.id)"
              href="javascript:void(0)"
          >
            {{ house.name }}
          </a>
        </li>
      </ul>

      <!-- Footer Buttons -->
      <div class="footer-buttons d-flex justify-content-between mt-4">
        <a href="javascript:void(0)" class="btn btn-info" @click="addRoomQuickly">
          <i class="fas fa-plus"></i> Thêm phòng nhanh
        </a>
        <a href="javascript:void(0)" class="btn btn-success" @click="addRoom">
          <i class="fas fa-bed"></i> Thêm phòng
        </a>
        <a href="javascript:void(0)" class="btn btn-primary" @click="editHouse">
          <i class="fas fa-edit"></i> Sửa nhà
        </a>
        <button class="btn btn-danger" @click="deleteHouse">
          <i class="fas fa-trash-alt"></i> Xóa nhà
        </button>
      </div>

      <!-- room Cards Section -->
      <div class="room-cards row">
        <div class="col-md-4 mb-4" v-for="room in filteredRooms" :key="room.id">
          <div class="card room-card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ room.name }} ({{ room.status }})</h5>
              <p class="card-text">
                Diện tích: {{ room.area }} m² <br />
                Giá thuê: {{ room.rent.toLocaleString() }} VND <br />
                Trạng thái phí: {{ room.feeStatus }} <br />
                Nhà: {{ activeHouseName }}
              </p>
              <div class="d-flex justify-content-between">
                <a href="javascript:void(0)" class="btn btn-primary">Sửa</a>
                <button class="btn btn-danger" @click="deleteRoom(room.id)">Xóa</button>
              </div>
              <div class="mt-3">
                <button class="btn btn-success w-100" @click="addTenant(room.id)">
                  <i class="fas fa-user-plus"></i> Thêm khách
                </button>
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
      floor: "A", // Ví dụ giá trị của biến floor là tầng 1
      selectedRoomStatus: '', // Trạng thái phòng (Còn trống hoặc Đã cho thuê)
      selectedFeeStatus: '', // Trạng thái phí (Chưa thu phí hoặc Đã thu phí)
      roomSearch: '', // Tìm kiếm tên phòng
      rooms: JSON.parse(localStorage.getItem('rooms')) || [],
      houses: JSON.parse(localStorage.getItem('houses')) || [],
      activeHouse: null, // Nhà hiện tại được chọn
    };
  },
  computed: {
    vacantRooms() {
      return this.filteredRooms.filter(room => room.status === 'Còn trống');
    },
    rentedRooms() {
      return this.filteredRooms.filter(room => room.status === 'Đã cho thuê');
    },
    unpaidFees() {
      return this.filteredRooms.filter(room => room.feeStatus === 'Chưa thu phí').length;
    },
    activeHouseName() {
      const house = this.houses.find(house => house.id === this.activeHouse);
      return house ? house.name : "Chưa chọn";
    },
    filteredRooms() {
      return this.rooms.filter(room => {
        return (
            (!this.activeHouse || room.houseId === this.activeHouse) &&
            (this.selectedRoomStatus === '' || room.status === this.selectedRoomStatus) &&
            (this.selectedFeeStatus === '' || room.feeStatus === this.selectedFeeStatus) &&
            room.name.toLowerCase().includes(this.roomSearch.toLowerCase())
        );
      });
    },
  },
  methods: {
    // Lọc danh sách phòng
    filterRooms() {
      if (this.filteredRooms.length === 0) {
        alert("Không có phòng nào phù hợp với tiêu chí lọc.");
      }
    },

    // Thêm nhà
    addHouse() {
      const houseName = prompt("Nhập tên nhà:");
      if (houseName) {
        const newHouse = {
          id: this.houses.length + 1,
          name: houseName
        };
        this.houses.push(newHouse);
        localStorage.setItem('houses', JSON.stringify(this.houses));
        alert(`Nhà ${houseName} đã được thêm thành công.`);
      } else {
        alert("Vui lòng nhập tên nhà.");
      }
    },

    // Thêm phòng
    addRoom() {
      const roomName = prompt("Nhập tên phòng:");
      const rent = prompt("Nhập giá thuê:");
      const area = prompt("Nhập diện tích phòng (m²):");
      const status = prompt("Nhập trạng thái phòng (Còn trống hoặc Đã cho thuê):");

      if (roomName && rent && area && status) {
        const newRoom = {
          id: this.rooms.length + 1,
          name: roomName,
          status: status,
          area: parseInt(area),
          rent: parseInt(rent),
          feeStatus: "Chưa thu phí",
          tenants: [],
          houseId: this.activeHouse
        };
        this.rooms.push(newRoom);
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
        alert(`Phòng ${roomName} đã được thêm.`);
      } else {
        alert("Vui lòng nhập đầy đủ thông tin phòng.");
      }
    },

    // Thêm phòng nhanh
    addRoomQuickly() {
      const roomName = prompt("Nhập tên phòng:");
      const rent = prompt("Nhập giá thuê:");
      if (roomName && rent) {
        const newRoom = {
          id: this.rooms.length + 1,
          name: roomName,
          status: "Còn trống",
          area: 25,
          rent: parseInt(rent),
          feeStatus: "Chưa thu phí",
          tenants: [],
          houseId: this.activeHouse // Gắn phòng vào nhà đã chọn
        };
        this.rooms.push(newRoom);
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
        alert(`Phòng ${roomName} đã được thêm nhanh.`);
      } else {
        alert("Vui lòng nhập đầy đủ thông tin phòng.");
      }
    },

    // Thêm khách vào phòng
    addTenant(roomId) {
      const tenantName = prompt("Nhập tên khách thuê:");
      if (tenantName) {
        const roomIndex = this.rooms.findIndex(room => room.id === roomId);
        if (roomIndex !== -1) {
          if (!this.rooms[roomIndex].tenants) {
            this.rooms[roomIndex].tenants = []; // Nếu phòng chưa có danh sách khách, tạo danh sách rỗng
          }
          this.rooms[roomIndex].tenants.push({name: tenantName});
          localStorage.setItem('rooms', JSON.stringify(this.rooms));
          alert(`Đã thêm khách ${tenantName} vào phòng ${this.rooms[roomIndex].name}`);
        }
      }
    },

    // Sửa nhà
    editHouse() {
      if (this.activeHouse) {
        const houseIndex = this.houses.findIndex(house => house.id === this.activeHouse);
        if (houseIndex !== -1) {
          const newHouseName = prompt("Nhập tên mới cho nhà:", this.houses[houseIndex].name);
          if (newHouseName) {
            this.houses[houseIndex].name = newHouseName;
            localStorage.setItem('houses', JSON.stringify(this.houses));
            alert(`Nhà đã được đổi tên thành: ${newHouseName}`);
          }
        }
      } else {
        alert("Vui lòng chọn một nhà để sửa.");
      }
    },

    // Xóa nhà và các phòng thuộc nhà đó
    deleteHouse() {
      if (this.activeHouse) {
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa nhà này và tất cả các phòng thuộc nhà?");
        if (confirmDelete) {
          // Xóa nhà khỏi danh sách
          this.houses = this.houses.filter(house => house.id !== this.activeHouse);
          // Xóa tất cả các phòng thuộc nhà đó
          this.rooms = this.rooms.filter(room => room.houseId !== this.activeHouse);
          localStorage.setItem('houses', JSON.stringify(this.houses));
          localStorage.setItem('rooms', JSON.stringify(this.rooms));
          this.activeHouse = null;
          alert("Nhà và tất cả các phòng thuộc nhà đã được xóa.");
        }
      } else {
        alert("Vui lòng chọn một nhà để xóa.");
      }
    },

    // Xóa phòng
    deleteRoom(roomId) {
      const roomIndex = this.rooms.findIndex(room => room.id === roomId);
      if (roomIndex !== -1) {
        const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa phòng ${this.rooms[roomIndex].name}?`);
        if (confirmDelete) {
          const roomName = this.rooms[roomIndex].name;
          this.rooms.splice(roomIndex, 1);
          localStorage.setItem('rooms', JSON.stringify(this.rooms));
          alert(`Phòng ${roomName} đã được xóa.`);
        }
      }
    },

    // Chọn nhà hiện tại
    setActiveHouse(houseId) {
      this.activeHouse = houseId;
      // Thông báo nhà đã chọn
      const selectedHouse = this.houses.find(house => house.id === houseId);
      alert(`Đã chọn nhà: ${selectedHouse.name}`);
    }
  },
};
</script>

<style scoped>
/* Thêm các style cần thiết */
.room-management {
  background-color: #f9f9f9;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.header-actions .btn {
  margin-left: 10px;
}

.filters-section {
  margin-bottom: 20px;
}

.room-cards .card {
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.footer-buttons .btn {
  margin-right: 10px;
}

</style>
