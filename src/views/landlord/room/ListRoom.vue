<template>
  <div class="list-room container mt-4">
    <!-- Header with search, back, save, and export buttons -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Danh Sách Phòng</h2>
      <div class="action-buttons">
        <input type="text" v-model="searchQuery" class="form-control me-2 d-inline" style="width: 200px;" placeholder="Tìm kiếm...">
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>
        <button class="btn btn-success me-2" @click="saveChanges">
          <i class="fa fa-save"></i> Lưu
        </button>
        <button class="btn btn-info" @click="exportToExcel">
          <i class="fa fa-file-excel"></i> Xuất Excel
        </button>
      </div>
    </div>

    <!-- Display errors if any -->
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Display warning if no rooms are found -->
    <div v-if="filteredRooms.length === 0" class="alert alert-warning">
      Không tìm thấy phòng nào phù hợp với từ khóa "{{ searchQuery }}".
    </div>

    <!-- Table to display rooms -->
    <table class="table table-bordered" v-if="filteredRooms.length > 0">
      <thead class="thead-light">
      <tr>
        <th>Tên phòng</th>
        <th>Khu vực</th>
        <th>Thứ tự</th>
        <th>Đơn giá (VNĐ)</th>
        <th>Ghi chú</th>
        <th>Hành động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(room, index) in filteredRooms" :key="index">
        <td>
          <input type="text" v-model="room.roomNumber" class="form-control" />
        </td>
        <td>{{ room.house }}</td>
        <td>
          <input type="number" v-model="room.order" class="form-control" />
        </td>
        <td>
          <input type="number" v-model="room.price" class="form-control" />
        </td>
        <td>
          <input type="text" v-model="room.note" class="form-control" />
        </td>
        <td>
          <button class="btn btn-sm btn-danger" @click="deleteRoom(index)">
            <i class="fa fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: "ListRoom",
  data() {
    return {
      rooms: [], // Room list from localStorage
      searchQuery: "", // Search keyword
      errors: [] // Store errors during validation
    };
  },
  computed: {
    // Filter the list of rooms based on the search keyword
    filteredRooms() {
      return this.rooms.filter((room) => {
        return String(room.roomNumber).toLowerCase().includes(this.searchQuery.toLowerCase().trim());
      });
    }
  },
  mounted() {
    // Load room list from localStorage
    const storedHomes = localStorage.getItem("homes");
    if (storedHomes) {
      const homes = JSON.parse(storedHomes);
      homes.forEach(home => {
        home.rooms.forEach(room => {
          this.rooms.push({
            ...room, // Include room properties like price, order, etc.
            house: home.name // Add house name to each room
          });
        });
      });
    }
  },
  methods: {
    // Navigate back to the previous page
    goBack() {
      this.$router.push("/landlord/room-index");
    },
    // Validate rooms before saving
    validate() {
      this.errors = [];
      const roomNumbers = new Set();
      const roomOrders = new Set();

      this.rooms.forEach((room) => {
        // Check for empty or duplicate room numbers
        const roomNumber = room.roomNumber.trim();
        if (!roomNumber) {
          this.errors.push(`Tên phòng không được để trống.`);
        } else if (roomNumbers.has(roomNumber)) {
          this.errors.push(`Tên phòng "${roomNumber}" bị trùng lặp!`);
        }

        // Check for valid and duplicate order numbers
        if (!room.order || room.order <= 0) {
          this.errors.push(`Thứ tự phòng không hợp lệ!`);
        } else if (roomOrders.has(room.order)) {
          this.errors.push(`Thứ tự "${room.order}" bị trùng lặp!`);
        }

        roomNumbers.add(roomNumber);
        roomOrders.add(room.order);
      });

      return this.errors.length === 0; // Return true if no errors
    },
    // Save changes to localStorage after validation
    saveChanges() {
      if (this.validate()) {
        // Group rooms by house and update the homes structure
        const homes = {};
        this.rooms.forEach(room => {
          if (!homes[room.house]) {
            homes[room.house] = {name: room.house, rooms: []};
          }
          homes[room.house].rooms.push(room);
        });

        localStorage.setItem("homes", JSON.stringify(Object.values(homes))); // Save the updated homes
        alert("Thay đổi đã được lưu!");
      }
    },
    // Delete a room
    deleteRoom(index) {
      if (confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
        this.rooms.splice(index, 1);
        this.saveChanges(); // Save after deletion
      }
    },
    // Export the list of rooms to an Excel file
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.rooms);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms");
      XLSX.writeFile(workbook, "DanhSachPhong.xlsx");
    }
  }
};
</script>

<style scoped>
.list-room {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-top: 20px;
}

.table th {
  background-color: #2a3f54;
  color: #fff;
}

thead {
  background-color: #f8f9fa;
}

.action-buttons .form-control {
  display: inline-block;
  margin-right: 10px;
}

input.form-control {
  border-radius: 5px;
}

h2 {
  color: #2a3f54;
  font-size: 30px;
  font-weight: 500;
  line-height: 48px;
  text-align: left;
}
</style>
