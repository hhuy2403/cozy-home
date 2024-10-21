<template>
  <div class="other-fee container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Danh sách phát sinh</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-warning me-2" @click="viewData">Xem</button>
        <button class="btn btn-success me-2" @click="addFee">+ Thêm</button>
        <button class="btn btn-danger me-2" @click="deleteSelected">Xóa</button>
        <button class="btn btn-info" @click="exportToExcel">
          <i class="fa fa-file-excel"></i> Xuất excel
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="selectedMonth">Tháng/năm</label>
        <input type="month" id="selectedMonth" v-model="selectedMonth" class="form-control" />
      </div>
      <div class="col-md-3">
        <label for="selectedHouse">Nhà</label>
        <select id="selectedHouse" v-model="selectedHouse" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="searchQuery">Tìm:</label>
        <input type="text" id="searchQuery" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm..." />
      </div>
    </div>

    <!-- Note Section -->
    <div class="alert alert-info">
      Lưu ý: Phát sinh là các số tiền ngoại lệ (các khoản tiền không cố định) mà khách phải trả (nhập số dương) hoặc được trừ bớt đi (nhập số âm).
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
        <tr>
          <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Diễn giải</th>
          <th>Số tiền (VND)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(fee, index) in filteredFees" :key="index">
          <td><input type="checkbox" v-model="selectedFees" :value="fee" /></td>
          <td>{{ fee.house }}</td>
          <td>{{ fee.roomNumber }}</td>
          <td>{{ fee.description }}</td>
          <td>{{ formatCurrency(fee.amount) }}</td>
        </tr>
        <tr v-if="filteredFees.length === 0">
          <td colspan="5" class="text-center">Không tìm thấy dòng nào phù hợp</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (if needed) -->
    <div class="row mt-3">
      <div class="col">
        <ul class="pagination justify-content-center">
          <!-- Pagination controls go here if required -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      selectedMonth: new Date().toISOString().substring(0, 7),
      selectedHouse: '',
      searchQuery: '',
      selectAll: false,
      houses: [], // This will be loaded from localStorage or API
      fees: [], // This will be loaded from localStorage or API
      selectedFees: [],
    };
  },
  computed: {
    filteredFees() {
      // Filter fees based on search query, selected house, and selected month
      let filtered = this.fees;

      if (this.selectedHouse) {
        filtered = filtered.filter(fee => fee.house === this.selectedHouse);
      }

      if (this.searchQuery.trim()) {
        filtered = filtered.filter(fee =>
            fee.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.selectedMonth) {
        filtered = filtered.filter(fee => fee.monthYear === this.selectedMonth);
      }

      return filtered;
    }
  },
  methods: {
    loadDataFromLocalStorage() {
      // Load data from localStorage
      const storedHouses = localStorage.getItem('homes');
      if (storedHouses) {
        this.houses = JSON.parse(storedHouses);
      }

      // Fetch all room keys and extract otherFees from each room
      this.fees = [];
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("_room_")) {
          const roomData = JSON.parse(localStorage.getItem(key));
          if (roomData.otherFees) {
            roomData.otherFees.forEach(fee => {
              this.fees.push({
                house: key.split('_room_')[0], // Extract house name from key
                roomNumber: key.split('_room_')[1], // Extract room number from key
                ...fee
              });
            });
          }
        }
      });
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedFees = [...this.filteredFees];
      } else {
        this.selectedFees = [];
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },
    viewData() {
      // Logic to view data based on the filters
      console.log('Viewing data for:', this.selectedMonth, this.selectedHouse);
    },
    addFee() {
      this.$router.push('/landlord/other-fee-create');
    },
    deleteSelected() {
      if (confirm('Bạn có chắc chắn muốn xóa các khoản phát sinh đã chọn?')) {
        this.fees = this.fees.filter(fee => !this.selectedFees.includes(fee));
        this.selectedFees = [];
        // You may also need to update the localStorage here to reflect the deletions
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("_room_")) {
            let roomData = JSON.parse(localStorage.getItem(key));
            if (roomData.otherFees) {
              roomData.otherFees = roomData.otherFees.filter(fee => !this.selectedFees.includes(fee));
              localStorage.setItem(key, JSON.stringify(roomData));
            }
          }
        });
        alert('Đã xóa thành công!');
      }
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(
          this.filteredFees.map(fee => ({
            "Nhà": fee.house,
            "Phòng": fee.roomNumber,
            "Diễn giải": fee.description,
            "Số tiền (VND)": fee.amount
          }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_phat_sinh");
      XLSX.writeFile(workbook, "Danh_sach_phat_sinh.xlsx");
    },
  },
  mounted() {
    this.loadDataFromLocalStorage();
  }
};
</script>

<style scoped>
.other-fee {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: left;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e2d3b;
}

.table-responsive {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.alert-info {
  margin-top: 20px;
}
</style>
