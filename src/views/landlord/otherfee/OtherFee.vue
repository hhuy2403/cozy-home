<template>
  <div class="other-fee container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Danh sách phát sinh</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-warning me-2" @click="viewData"><i class="fas fa-search"></i> Xem</button>
        <button class="btn btn-success me-2" @click="addFee"><i class="fas fa-plus"></i> Thêm</button>
        <button class="btn btn-danger me-2" @click="deleteSelected"><i class="fas fa-trash"></i> Xóa</button>
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
        <input type="text" id="searchQuery" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm theo nhà, phòng, diễn giải, hoặc số tiền..." />
      </div>
    </div>

    <!-- Note Section -->
    <div class="alert alert-info">
      Lưu ý: Phát sinh là các số tiền ngoại lệ (các khoản tiền không cố định) mà khách phải trả (nhập số dương) hoặc được trừ bớt đi (nhập số âm).
    </div>

    <!-- Warning for No Results -->
    <div v-if="filteredFees.length === 0" class="alert alert-warning">
      <strong>Không tìm thấy dòng nào phù hợp với từ khóa tìm kiếm.</strong>
    </div>

    <!-- Table Section -->
    <div class="table-responsive" v-if="filteredFees.length > 0">
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
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(fee =>
            fee.description.toLowerCase().includes(query) ||
            fee.house.toLowerCase().includes(query) ||
            fee.roomNumber.toString().includes(query) ||
            fee.amount.toString().includes(query)
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
      // Load danh sách nhà từ localStorage
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        this.houses = JSON.parse(storedHomes);  // Parse dữ liệu nhà
        this.fees = [];  // Khởi tạo danh sách phát sinh

        // Duyệt qua từng nhà và từng phòng để lấy các khoản phát sinh
        this.houses.forEach(home => {
          home.rooms.forEach(room => {
            if (room.otherFees) {
              room.otherFees.forEach(fee => {
                this.fees.push({
                  house: home.name,  // Tên nhà
                  roomNumber: room.roomNumber,  // Số phòng
                  description: fee.description,  // Diễn giải
                  amount: fee.amount,  // Số tiền
                  monthYear: fee.monthYear  // Tháng/Năm
                });
              });
            }
          });
        });
      }
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
      console.log('Viewing data for:', this.selectedMonth, this.selectedHouse);
      // Filter logic
      this.applyFilters();
    },

    addFee() {
      this.$router.push('/landlord/other-fee-create');
    },

    deleteSelected() {
      if (this.selectedFees.length === 0) {
        alert('Vui lòng chọn ít nhất một khoản phát sinh để xóa.');
        return;
      }

      if (confirm('Bạn có chắc chắn muốn xóa các khoản phát sinh đã chọn?')) {
        // Step 1: Remove selected fees from the local `fees` array
        this.fees = this.fees.filter(fee => !this.selectedFees.includes(fee));

        // Step 2: Remove selected fees from localStorage
        let storedHomes = JSON.parse(localStorage.getItem('homes')) || [];

        storedHomes.forEach(home => {
          home.rooms.forEach(room => {
            // Find room's otherFees and remove the selected fees
            if (room.otherFees) {
              room.otherFees = room.otherFees.filter(fee => {
                // Compare each fee's house, room number, description, and amount with selected fees
                return !this.selectedFees.some(selectedFee =>
                    selectedFee.house === home.name &&
                    selectedFee.roomNumber === room.roomNumber &&
                    selectedFee.description === fee.description &&
                    selectedFee.amount === fee.amount
                );
              });
            }
          });
        });

        // Save updated homes back to localStorage
        localStorage.setItem('homes', JSON.stringify(storedHomes));

        // Clear selected fees
        this.selectedFees = [];

        // Show success message
        alert('Đã xóa thành công các khoản phát sinh!');
      }
    },

    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(
          this.filteredFees.map(fee => ({
            "Nhà": fee.house,
            "Phòng": fee.roomNumber,
            "Diễn giải": fee.description,
            "Số tiền (VND)": this.formatCurrency(fee.amount),
          }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_phat_sinh");
      XLSX.writeFile(workbook, "Danh_sach_phat_sinh.xlsx");
    },

    applyFilters() {
      // Logic để lọc dữ liệu theo nhà, tháng và tìm kiếm
      let filtered = this.fees;

      if (this.selectedHouse) {
        filtered = filtered.filter(fee => fee.house === this.selectedHouse);
      }

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(fee =>
            fee.description.toLowerCase().includes(query) ||
            fee.house.toLowerCase().includes(query) ||
            fee.roomNumber.toString().includes(query) ||
            fee.amount.toString().includes(query)
        );
      }

      if (this.selectedMonth) {
        filtered = filtered.filter(fee => fee.monthYear === this.selectedMonth);
      }

      this.filteredFees = filtered;
    }
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

.alert-info, .alert-warning {
  margin-top: 20px;
}

</style>
