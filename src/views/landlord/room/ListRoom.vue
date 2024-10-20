<template>
  <div class="list-room container mt-4">
    <!-- Header với nút tìm kiếm, quay về, lưu, và xuất file -->
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

    <!-- Hiển thị lỗi nếu có -->
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Hiển thị danh sách phòng rỗng nếu không tìm thấy -->
    <div v-if="filteredRooms.length === 0" class="alert alert-warning">
      Không tìm thấy phòng nào phù hợp với từ khóa "{{ searchQuery }}".
    </div>

    <!-- Bảng hiển thị danh sách phòng -->
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
          <button class="btn btn-danger" @click="deleteRoom(index)">
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
      rooms: [], // Danh sách các phòng từ localStorage
      searchQuery: "", // Biến lưu trữ từ khóa tìm kiếm
      errors: [] // Biến lưu trữ các lỗi khi validate
    };
  },
  computed: {
    // Lọc danh sách phòng theo từ khóa tìm kiếm
    filteredRooms() {
      return this.rooms.filter((room) => {
        return String(room.roomNumber).toLowerCase().includes(this.searchQuery.toLowerCase().trim());
      });
    }
  },
  mounted() {
    // Lấy danh sách phòng từ localStorage
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      this.rooms = JSON.parse(storedRooms);
    }
  },
  methods: {
    // Hàm quay về trang trước
    goBack() {
      this.$router.push("/landlord/room-index");
    },
    // Hàm kiểm tra trùng lặp tên phòng và thứ tự
    validate() {
      this.errors = [];
      const roomNumbers = new Set();
      const roomOrders = new Set();

      this.rooms.forEach((room) => {
        // Kiểm tra rỗng hoặc trùng lặp tên phòng
        const roomNumber = room.roomNumber.trim();
        if (!roomNumber) {
          this.errors.push(`Tên phòng không được để trống.`);
        } else if (roomNumbers.has(roomNumber)) {
          this.errors.push(`Tên phòng "${roomNumber}" bị trùng lặp!`);
        }

        // Kiểm tra trùng lặp thứ tự
        if (!room.order || room.order <= 0) {
          this.errors.push(`Thứ tự phòng không hợp lệ!`);
        } else if (roomOrders.has(room.order)) {
          this.errors.push(`Thứ tự "${room.order}" bị trùng lặp!`);
        }

        roomNumbers.add(roomNumber);
        roomOrders.add(room.order);
      });

      return this.errors.length === 0; // Nếu không có lỗi, trả về true
    },
    // Hàm lưu thay đổi vào localStorage sau khi validate
    saveChanges() {
      if (this.validate()) {
        localStorage.setItem("rooms", JSON.stringify(this.rooms));
        alert("Thay đổi đã được lưu!");
      }
    },
    // Hàm xóa phòng
    deleteRoom(index) {
      if (confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
        this.rooms.splice(index, 1);
        localStorage.setItem("rooms", JSON.stringify(this.rooms)); // Lưu lại sau khi xóa
      }
    },
    // Hàm xuất danh sách phòng ra file Excel
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
  margin-top: 30px;
  padding: 20px;
}

.table {
  margin-top: 20px;
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
  font-size: 24px;
  font-weight: bold;
  color: #2a3f54;
}
</style>
