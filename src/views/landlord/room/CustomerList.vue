<template>
  <div class="customer-list container mt-4">
    <!-- Header with search, back, save, and export buttons -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Danh Sách Khách Thuê</h2>
      <div class="action-buttons">
        <!-- Multi-criteria search -->
        <input type="text" v-model="searchQuery" class="form-control me-2 d-inline" style="width: 200px;" placeholder="Tìm kiếm...">
        <select v-model="filterPaymentCycle" class="form-select me-2 d-inline" style="width: 150px;">
          <option value="">Kỳ thanh toán</option>
          <option value="Kỳ 30">Kỳ 30</option>
          <option value="Kỳ 15">Kỳ 15</option>
        </select>

        <!-- Back button -->
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>

        <!-- Save button -->
        <button class="btn btn-success me-2" @click="saveCustomers">
          <i class="fa fa-save"></i> Lưu
        </button>

        <!-- Export to Excel button -->
        <button class="btn btn-info" @click="exportToExcel">
          <i class="fa fa-file-excel"></i> Xuất Excel
        </button>
      </div>
    </div>

    <!-- Display the number of found results -->
    <p v-if="filteredCustomers.length > 0" class="mb-3">Tìm thấy {{ filteredCustomers.length }} khách thuê.</p>

    <!-- Display errors if any -->
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Display warning if no tenants are found -->
    <div v-if="filteredCustomers.length === 0" class="alert alert-warning">
      Không tìm thấy khách thuê phù hợp với từ khóa "{{ searchQuery }}".
    </div>

    <!-- Table to display tenants -->
    <table class="table table-bordered table-striped" v-if="filteredCustomers.length > 0">
      <thead class="table-dark">
      <tr>
        <th>Phòng số</th>
        <th>Khu vực</th>
        <th>Họ tên</th>
        <th>Số điện thoại</th>
        <th>Ngày bắt đầu</th>
        <th>Tiền phòng (VNĐ)</th>
        <th>Đặt cọc (VNĐ)</th>
        <th>Kỳ thanh toán</th>
        <th>Hành động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(customer, index) in filteredCustomers" :key="index">
        <td>{{ customer.roomNumber }}</td>
        <td>{{ customer.house }}</td>
        <td>{{ customer.fullName }}</td>
        <td>
          <input type="text" v-model="customer.phoneNumber" class="form-control form-control" />
        </td>
        <td>{{ customer.startDate }}</td>
        <td>
          <input type="number" v-model="customer.rentalCost" class="form-control form-control" readonly/>
        </td>
        <td>
          <input type="number" v-model="customer.deposit" class="form-control form-control" />
        </td>
        <td>{{ customer.paymentCycle }}</td>
        <td>
          <button class="btn btn-sm btn-danger" @click="deleteCustomer(customer)">
            <i class="fa fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'; // For exporting to Excel

export default {
  data() {
    return {
      searchQuery: "", // Multi-criteria search
      filterPaymentCycle: "", // Filter by payment cycle
      customers: [], // List of tenants
      errors: []
    };
  },
  mounted() {
    // Load data from localStorage
    this.loadCustomersFromLocalStorage();
  },
  computed: {
    filteredCustomers() {
      // Search by multiple criteria
      let results = this.customers;

      if (this.searchQuery.trim()) {
        results = results.filter(customer =>
            customer.roomNumber.toString().includes(this.searchQuery.toLowerCase()) ||
            customer.house.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            customer.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            customer.phoneNumber.includes(this.searchQuery)
        );
      }

      // Filter by payment cycle
      if (this.filterPaymentCycle) {
        results = results.filter(customer =>
            customer.paymentCycle === this.filterPaymentCycle
        );
      }

      return results;
    }
  },
  methods: {
    loadCustomersFromLocalStorage() {
      // Load data from localStorage
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);
        homes.forEach(home => {
          home.rooms.forEach(room => {
            if (room.customer) {
              // Add tenant to the list
              this.customers.push({
                roomNumber: room.roomNumber,
                house: home.name,
                fullName: room.customer.fullName,
                phoneNumber: room.customer.phoneNumber1,
                startDate: room.customer.startDate,
                rentalCost: room.customer.rentalCost,
                deposit: room.customer.deposit,
                paymentCycle: room.customer.paymentCycle,
              });
            }
          });
        });
      }
    },
    goBack() {
      // Handle back navigation
      this.$router.push('/landlord/room-index');
    },
    saveCustomers() {
      // Save the tenant list back into localStorage
      this.customers.forEach(customer => {
        const home = JSON.parse(localStorage.getItem('homes')).find(h => h.name === customer.house);
        const room = home.rooms.find(r => r.roomNumber === customer.roomNumber);

        if (room) {
          room.customer = {
            fullName: customer.fullName,
            phoneNumber1: customer.phoneNumber,
            startDate: customer.startDate,
            rentalCost: customer.rentalCost,
            deposit: customer.deposit,
            paymentCycle: customer.paymentCycle
          };
        }

        localStorage.setItem('homes', JSON.stringify(home));
      });

      alert('Dữ liệu đã được lưu thành công vào localStorage!');
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.filteredCustomers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Khách thuê');
      XLSX.writeFile(workbook, 'Danh_sach_khach_thue.xlsx');
    },
    deleteCustomer(customer) {
      // Confirm delete tenant
      if (confirm(`Bạn có chắc chắn muốn xóa khách thuê: ${customer.fullName}?`)) {
        // Remove tenant data from localStorage
        const home = JSON.parse(localStorage.getItem('homes')).find(h => h.name === customer.house);
        const room = home.rooms.find(r => r.roomNumber === customer.roomNumber);

        if (room) {
          room.customer = null; // Remove tenant information
        }

        localStorage.setItem('homes', JSON.stringify(home));

        // Remove tenant from the UI
        this.customers = this.customers.filter(c => c.roomNumber !== customer.roomNumber);
        alert('Đã xóa khách thuê và thông tin phòng liên quan!');
      }
    }
  }
};
</script>

<style scoped>
.customer-list {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2a3f54;
  font-size: 30px;
  font-weight: 500;
  line-height: 48px;
  text-align: left;
}

.table th, .table td {
  vertical-align: middle;
}

.table th {
  background-color: #2a3f54;
  color: #fff;
}

.table tbody td input.form-control-sm {
  padding: 4px;
  font-size: 0.875rem;
}

.action-buttons .form-control {
  display: inline-block;
  margin-right: 10px;
}
</style>
