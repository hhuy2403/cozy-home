<template>
  <div class="datapower container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Chỉ số điện</h2>
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
        <label for="selectedHouse">Nhà</label>
        <select id="selectedHouse" v-model="selectedHouse" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="house in houses" :key="house.id" :value="house.id">
            {{ house.name }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="roomStatus">Trạng thái phòng</label>
        <select id="roomStatus" v-model="roomStatus" class="form-select">
          <option value="">Tất cả</option>
          <option value="rented">Đã cho thuê</option>
          <option value="available">Còn trống</option>
        </select>
      </div>
    </div>

    <div class="alert alert-info">
      <strong>Lưu ý:</strong> Bạn phải gán dịch vụ thuộc loại điện cho khách thuê trước thì
      phần chỉ số này mới được tính cho phòng đó khi tính tiền.
      <p>Đối với lần đầu tiên sử dụng phần mềm bạn sẽ phải nhập chỉ số cũ và mới cho tháng sử dụng đầu tiên,
        các tháng tiếp theo phần mềm sẽ tự động lấy chỉ số mới tháng trước làm chỉ số cũ tháng sau.</p>
    </div>

    <!-- Warning Section -->
    <div v-if="warningMessage" class="alert alert-warning">
      <strong>Cảnh báo:</strong> Chỉ số điện cũ lớn hơn chỉ số điện mới.
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
        <tr>
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Khách thuê</th>
          <th>CS Điện Cũ</th>
          <th>CS Điện Mới</th>
          <th>Sử dụng Điện</th>
          <th>Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="room in filteredRooms" :key="room.roomNumber">
          <td>{{ room.houseName }}</td>
          <td>{{ room.roomNumber }}</td>
          <td>{{ room.customer?.fullName || 'Chưa có khách thuê' }}</td>
          <td>
            <input
                type="number"
                class="form-control form-control-sm"
                v-model="room.oldElectricIndex"
                :disabled="room.isPaid"
            />
          </td>
          <td>
            <input
                type="number"
                class="form-control form-control-sm"
                v-model="room.newElectricIndex"
                @input="calculateElectricUsage(room)"
                :disabled="room.isPaid"
            />
          </td>
          <td>{{ room.electricUsage }}</td>
          <td>
            <button
                class="btn btn-primary btn-sm"
                @click="saveRoomData(room)"
                :disabled="room.isPaid"
            >
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
      selectedMonth: new Date().toISOString().substring(0, 7),
      selectedHouse: "",
      roomStatus: "",
      houses: [],
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
        this.applyFilters();
      }
    },
    applyFilters() {
      this.filteredRooms = this.houses.flatMap(house =>
          house.rooms.map(room => {
            const electricDataForMonth = room.electricData?.find(data => data.monthYear === this.selectedMonth);
            const previousMonth = this.getPreviousMonth(this.selectedMonth);
            const electricDataForPreviousMonth = room.electricData?.find(data => data.monthYear === previousMonth);

            return {
              ...room,
              houseName: house.name,
              isPaid: room.paymentHistory?.[this.selectedMonth]?.totalAmount > 0,
              oldElectricIndex: electricDataForMonth ? electricDataForMonth.oldElectricIndex : (electricDataForPreviousMonth ? electricDataForPreviousMonth.newElectricIndex : 0),
              newElectricIndex: electricDataForMonth?.newElectricIndex || 0,
              electricUsage: electricDataForMonth?.electricUsage || 0,
              status: room.isRented ? "rented" : "available",
            };
          })
      ).filter(room => {
        const matchesHouse = this.selectedHouse ? room.house === this.selectedHouse : true;
        const matchesStatus = this.roomStatus ? room.status === this.roomStatus : true;
        return matchesHouse && matchesStatus;
      });
    },
    handleMonthChange() {
      this.applyFilters();
    },
    getPreviousMonth(currentMonth) {
      const date = new Date(currentMonth + "-01");
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().substring(0, 7); // Trả về tháng trước theo định dạng YYYY-MM
    },
    calculateElectricUsage(room) {
      if (room.newElectricIndex >= room.oldElectricIndex) {
        room.electricUsage = room.newElectricIndex - room.oldElectricIndex;
        this.warningMessage = false;
      } else {
        room.electricUsage = 0;
        this.warningMessage = true;
      }
    },
    saveRoomData(room) {
      const houseIndex = this.houses.findIndex(h => h.id === room.house);
      if (houseIndex === -1) {
        alert("Không tìm thấy nhà.");
        return;
      }

      const roomIndex = this.houses[houseIndex].rooms.findIndex(
          r => r.roomNumber === room.roomNumber
      );
      if (roomIndex === -1) {
        alert("Không tìm thấy phòng.");
        return;
      }

      // Thêm hoặc cập nhật dữ liệu chỉ số điện vào trường `electricData` trong phòng
      if (!this.houses[houseIndex].rooms[roomIndex].electricData) {
        this.houses[houseIndex].rooms[roomIndex].electricData = [];
      }

      const existingDataIndex = this.houses[houseIndex].rooms[roomIndex].electricData.findIndex(
          data => data.monthYear === this.selectedMonth
      );

      const newElectricData = {
        monthYear: this.selectedMonth,
        oldElectricIndex: room.oldElectricIndex,
        newElectricIndex: room.newElectricIndex,
        electricUsage: room.electricUsage,
      };

      if (existingDataIndex === -1) {
        this.houses[houseIndex].rooms[roomIndex].electricData.push(newElectricData);
      } else {
        this.houses[houseIndex].rooms[roomIndex].electricData[existingDataIndex] = newElectricData;
      }

      // Lưu vào localStorage
      localStorage.setItem("homes", JSON.stringify(this.houses));

      alert(`Dữ liệu phòng ${room.roomNumber} đã được lưu!`);
    },
    saveAllData() {
      this.filteredRooms.forEach((room) => {
        if (!room.isPaid) {
          this.saveRoomData(room);
        }
      });
      alert("Dữ liệu của tất cả các phòng đã được lưu!");
    },
    viewData() {
      this.applyFilters();
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(
          this.filteredRooms.map((room) => ({
            Nhà: room.houseName,
            Phòng: room.roomNumber,
            "Khách thuê": room.customer?.fullName || "Chưa có khách thuê",
            "CS Điện Cũ": room.oldElectricIndex,
            "CS Điện Mới": room.newElectricIndex,
            "Sử dụng Điện": room.electricUsage,
          }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Chỉ số điện");
      XLSX.writeFile(workbook, "Chi_so_dien.xlsx");
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
.datapower {
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
