<template>
  <div class="customer-list container mt-4">
    <!-- Header với nút tìm kiếm, quay về, lưu, và xuất file -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Danh Sách Khách Thuê</h2>
      <div class="action-buttons">
        <!-- Tìm kiếm đa tiêu chí -->
        <input type="text" v-model="searchQuery" class="form-control me-2 d-inline" style="width: 200px;" placeholder="Tìm kiếm...">
        <select v-model="filterPaymentCycle" class="form-select me-2 d-inline" style="width: 150px;">
          <option value="">Kỳ thanh toán</option>
          <option value="Kỳ 30">Kỳ 30</option>
          <option value="Kỳ 15">Kỳ 15</option>
        </select>

        <!-- Nút Quay về -->
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>

        <!-- Nút Lưu -->
        <button class="btn btn-success me-2" @click="saveCustomers">
          <i class="fa fa-save"></i> Lưu
        </button>

        <!-- Nút Xuất Excel -->
        <button class="btn btn-info" @click="exportToExcel">
          <i class="fa fa-file-excel"></i> Xuất Excel
        </button>
      </div>
    </div>

    <!-- Hiển thị số kết quả tìm thấy -->
    <p v-if="filteredCustomers.length > 0" class="mb-3">Tìm thấy {{ filteredCustomers.length }} khách thuê.</p>

    <!-- Hiển thị lỗi nếu có -->
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Hiển thị danh sách khách thuê rỗng nếu không tìm thấy -->
    <div v-if="filteredCustomers.length === 0" class="alert alert-warning">
      Không tìm thấy khách thuê phù hợp với từ khóa "{{ searchQuery }}".
    </div>

    <!-- Bảng hiển thị danh sách khách thuê -->
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
        <th>Kì thanh toán</th>
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
          <button class="btn btn-danger btn-sm" @click="deleteCustomer(customer)">
            <i class="fa fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'; // Để xuất file Excel

export default {
  data() {
    return {
      searchQuery: "", // Tìm kiếm đa tiêu chí
      filterPaymentCycle: "", // Lọc theo kỳ thanh toán
      customers: [], // Danh sách khách thuê
      errors: []
    };
  },
  mounted() {
    // Lấy dữ liệu từ localStorage
    this.loadCustomersFromLocalStorage();
  },
  computed: {
    filteredCustomers() {
      // Tìm kiếm theo các tiêu chí
      let results = this.customers;

      if (this.searchQuery.trim()) {
        results = results.filter(customer =>
            customer.roomNumber.toString().includes(this.searchQuery.toLowerCase()) ||
            customer.house.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            customer.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            customer.phoneNumber.includes(this.searchQuery)
        );
      }

      // Lọc theo kỳ thanh toán
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
      // Lấy dữ liệu từ localStorage
      const storedRooms = localStorage.getItem('rooms');
      if (storedRooms) {
        const rooms = JSON.parse(storedRooms);
        rooms.forEach(room => {
          const roomKey = `${room.house}_room_${room.roomNumber}`;
          const roomData = localStorage.getItem(roomKey);
          if (roomData) {
            const roomDetails = JSON.parse(roomData);
            if (roomDetails.customer) {
              // Thêm khách thuê vào danh sách
              this.customers.push({
                roomNumber: room.roomNumber,
                house: room.house,
                fullName: roomDetails.customer.fullName,
                phoneNumber: roomDetails.customer.phoneNumber1,
                startDate: roomDetails.customer.startDate,
                rentalCost: roomDetails.customer.rentalCost,
                deposit: roomDetails.customer.deposit,
                paymentCycle: roomDetails.customer.paymentCycle,
              });
            }
          }
        });
      }
    },
    goBack() {
      // Xử lý quay về trang trước
      this.$router.push('/landlord/room-index');
    },
    saveCustomers() {
      // Lưu danh sách khách thuê vào localStorage
      this.customers.forEach(customer => {
        const roomKey = `${customer.house}_room_${customer.roomNumber}`;
        let roomData = JSON.parse(localStorage.getItem(roomKey)) || {};
        roomData.customer = {
          fullName: customer.fullName,
          phoneNumber1: customer.phoneNumber,
          startDate: customer.startDate,
          rentalCost: customer.rentalCost,
          deposit: customer.deposit,
          paymentCycle: customer.paymentCycle
        };
        localStorage.setItem(roomKey, JSON.stringify(roomData));
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
      // Xác nhận xóa khách thuê
      if (confirm(`Bạn có chắc chắn muốn xóa khách thuê: ${customer.fullName}?`)) {
        // Xóa thông tin khách thuê và phòng liên quan trong localStorage
        const roomKey = `${customer.house}_room_${customer.roomNumber}`;
        localStorage.removeItem(roomKey); // Xóa luôn cả thông tin phòng và khách thuê
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
  font-size: 24px;
  font-weight: bold;
  color: #2a3f54;
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
