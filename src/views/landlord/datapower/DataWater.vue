<template>
  <div class="datawater container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Chỉ số nước</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-warning me-2" @click="viewData"><i class="fas fa-search"></i> Xem</button>
        <button class="btn btn-success me-2" @click="saveAllData"><i class="fas fa-save"></i> Lưu</button>
        <button class="btn btn-info" @click="exportToExcel">
          <i class="fa fa-file-excel"></i> Xuất file excel
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="selectedMonth">Tháng/năm</label>
        <input type="month" id="selectedMonth" v-model="selectedMonth" class="form-control" @change="handleMonthChange" />
      </div>
      <div class="col-md-3">
        <label for="selectedCycle">Kỳ</label>
        <select id="selectedCycle" v-model="selectedCycle" class="form-select">
          <option value="">Tất cả</option>
          <option value="Kỳ 30">Kỳ 30</option>
          <option value="Kỳ 15">Kỳ 15</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="selectedHouse">Nhà</label>
        <select id="selectedHouse" v-model="selectedHouse" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="house in houses" :key="house.name" :value="house.name">
            {{ house.name }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="roomStatus">Trạng thái phòng</label>
        <select id="roomStatus" v-model="roomStatus" class="form-select">
          <option value="">Tất cả</option>
          <option value="available">Còn trống</option>
          <option value="rented">Đã cho thuê</option>
        </select>
      </div>
    </div>

    <!-- Warning Section -->
    <div v-if="warningMessage" class="alert alert-warning">
      <strong>Cảnh báo:</strong> Chỉ số nước cũ lớn hơn chỉ số nước mới.
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
        <tr>
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Khách thuê</th>
          <th>CS Nước Cũ</th>
          <th>CS Nước Mới</th>
          <th>Sử dụng Nước</th>
          <th>Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="room in filteredRooms" :key="room.roomNumber">
          <td>{{ room.house }}</td>
          <td>{{ room.roomNumber }}</td>
          <td>{{ room.customer?.fullName || 'Chưa có khách thuê' }}</td>
          <td>
            <input type="number" class="form-control form-control-sm" v-model="room.oldWaterIndex" />
          </td>
          <td>
            <input type="number" class="form-control form-control-sm" v-model="room.newWaterIndex" @input="calculateWaterUsage(room)" />
          </td>
          <td>{{ room.waterUsage }}</td> <!-- Thay 'usage' bằng 'waterUsage' -->
          <td>
            <button class="btn btn-primary btn-sm" @click="saveRoomData(room)">
              <i class="fas fa-save"></i> Lưu
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      selectedMonth: new Date().toISOString().substring(0, 7), // Tháng hiện tại
      selectedCycle: "",
      selectedHouse: "",
      roomStatus: "",
      houses: [],
      rooms: [],
      filteredRooms: [],
      warningMessage: false,
    };
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHouses = localStorage.getItem("homes");
      if (storedHouses) {
        this.houses = JSON.parse(storedHouses);
      }

      const storedRooms = localStorage.getItem("rooms");
      if (storedRooms) {
        this.rooms = JSON.parse(storedRooms).map((room) => {
          const roomKey = `${room.house}_room_${room.roomNumber}`;
          const storedRoomData = localStorage.getItem(roomKey);
          if (storedRoomData) {
            const roomData = JSON.parse(storedRoomData);
            return {
              ...room,
              customer: roomData.customer,
              oldWaterIndex: roomData.oldWaterIndex || 0,
              newWaterIndex: roomData.newWaterIndex || 0,
              waterUsage: roomData.waterUsage || 0,
            };
          } else {
            return room;
          }
        });
      }

      this.applyFilters();
    },
    handleMonthChange() {
      this.filteredRooms.forEach((room) => {
        const previousMonth = this.getPreviousMonth(this.selectedMonth);
        const roomKey = `${room.house}_room_${room.roomNumber}`;
        const storedRoomData = localStorage.getItem(roomKey);
        if (storedRoomData) {
          const roomData = JSON.parse(storedRoomData);
          // Lấy chỉ số nước từ tháng trước và cập nhật vào chỉ số cũ
          if (roomData[previousMonth] && roomData[previousMonth].newWaterIndex) {
            room.oldWaterIndex = roomData[previousMonth].newWaterIndex;
          }
        }
      });
    },
    getPreviousMonth(currentMonth) {
      const date = new Date(currentMonth + "-01");
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().substring(0, 7); // Trả về tháng trước theo định dạng YYYY-MM
    },
    calculateWaterUsage(room) {
      if (room.newWaterIndex >= room.oldWaterIndex) {
        room.waterUsage = room.newWaterIndex - room.oldWaterIndex;
        this.warningMessage = false;
      } else {
        room.waterUsage = 0;
        this.warningMessage = true;
      }
    },
    applyFilters() {
      this.filteredRooms = this.rooms.filter((room) => {
        const matchesHouse =
            this.selectedHouse === "" || room.house === this.selectedHouse;
        const matchesStatus =
            this.roomStatus === "" ||
            (this.roomStatus === "available" ? !room.customer : room.customer);
        return matchesHouse && matchesStatus;
      });
    },
    saveRoomData(room) {
      const roomKey = `${room.house}_room_${room.roomNumber}`;
      const monthYearKey = this.selectedMonth;
      const storedRoomData = localStorage.getItem(roomKey);
      let roomData = storedRoomData ? JSON.parse(storedRoomData) : {};

      if (!roomData[monthYearKey]) {
        roomData[monthYearKey] = {};
      }
      roomData[monthYearKey].oldWaterIndex = room.oldWaterIndex;
      roomData[monthYearKey].newWaterIndex = room.newWaterIndex;
      roomData[monthYearKey].waterUsage = room.waterUsage;

      localStorage.setItem(roomKey, JSON.stringify(roomData));
      alert(`Dữ liệu phòng ${room.roomNumber} cho tháng ${monthYearKey} đã được lưu!`);
    },
    saveAllData() {
      this.filteredRooms.forEach((room) => {
        this.saveRoomData(room);
      });
      alert("Dữ liệu của tất cả các phòng đã được lưu!");
    },
    viewData() {
      this.applyFilters();
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(
          this.filteredRooms.map((room) => ({
            Nhà: room.house,
            Phòng: room.roomNumber,
            "Khách thuê": room.customer?.fullName || "Chưa có khách thuê",
            "CS Nước Cũ": room.oldWaterIndex,
            "CS Nước Mới": room.newWaterIndex,
            "Sử dụng Nước": room.waterUsage,
          }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Chỉ số nước");
      XLSX.writeFile(workbook, "Chi_so_nuoc.xlsx");
    },
  },
  watch: {
    selectedHouse() {
      this.applyFilters();
    },
    roomStatus() {
      this.applyFilters();
    },
  },
};
</script>

<style scoped>
.datawater {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-responsive {
  margin-top: 20px;
}

.alert-warning {
  margin-top: 20px;
}

h2 {
  text-align: left;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e2d3b;
}

label {
  font-weight: 600;
}

.action-buttons .btn {
  margin-right: 10px;
}

.action-buttons .btn-info {
  color: #fff;
}
</style>
