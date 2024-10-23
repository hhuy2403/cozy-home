<template>
  <div class="container mt-4 report-customer-debt">
    <h2>Danh sách khách nợ tiền phòng</h2>

    <!-- Filter Section -->
    <div class="row mb-3 align-items-end">
      <div class="col-md-3">
        <label for="houseSelect" class="form-label">Nhà</label>
        <select id="houseSelect" class="form-select" v-model="selectedHouse">
          <option value="">Tất cả</option>
          <option v-for="house in houses" :key="house.id" :value="house.name">
            {{ house.name }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="roomSelect" class="form-label">Phòng</label>
        <select id="roomSelect" class="form-select" v-model="selectedRoom">
          <option value="">Phòng</option>
          <option v-for="room in filteredRooms" :key="room.id" :value="room.roomNumber">
            {{ room.roomNumber }}
          </option>
        </select>
      </div>
      <div class="col-md-2 d-flex align-items-end">
        <button class="btn btn-warning w-100" @click="fetchReport">
          <i class="fas fa-search"></i> Xem
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-light">
        <tr>
          <th>Họ tên khách</th>
          <th>Địa chỉ</th>
          <th>Điện thoại</th>
          <th>Nhà</th>
          <th>Thuê phòng</th>
          <th>Từ ngày</th>
          <th>Đến ngày</th>
          <th>Trạng thái</th>
          <th>Tổng tiền phí (VND)</th>
          <th>Đã trả (VND)</th>
          <th>Còn lại (VND)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(customer, index) in filteredCustomers" :key="index">
          <td>{{ customer.fullName }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.phoneNumber }}</td>
          <td>{{ customer.houseName }}</td>
          <td>{{ customer.roomNumber }}</td>
          <td>{{ customer.startDate }}</td>
          <td>{{ customer.endDate }}</td>
          <td>{{ customer.status }}</td>
          <td>{{ formatCurrency(customer.totalFees) }}</td>
          <td>{{ formatCurrency(customer.paid) }}</td>
          <td>{{ formatCurrency(customer.remaining) }}</td>
        </tr>
        <tr v-if="filteredCustomers.length === 0">
          <td colspan="11" class="text-center">Không có dữ liệu</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHouse: "",
      selectedRoom: "",
      houses: [],
      rooms: [],
      customers: [],
    };
  },
  computed: {
    filteredRooms() {
      return this.selectedHouse
          ? this.rooms.filter((room) => room.houseName === this.selectedHouse)
          : this.rooms;
    },
    filteredCustomers() {
      return this.customers.filter((customer) => customer.remaining > 0);
    },
  },
  methods: {
    fetchReport() {
      try {
        const homes = JSON.parse(localStorage.getItem("homes") || "[]");
        let customersData = [];

        homes.forEach((home) => {
          home.rooms.forEach((room) => {
            if (room.customer) {
              const { customer, contract } = room;
              const paymentHistory =
                  customer.paymentHistory?.[this.getCurrentMonth()] || {};

              customersData.push({
                fullName: customer.fullName,
                address: customer.address || "Không có",
                phoneNumber: customer.phoneNumber1 || "Không có",
                houseName: home.name,
                roomNumber: room.roomNumber,
                startDate: customer.startDate || "N/A",
                endDate: contract?.endDate || "N/A",
                status: room.isRented ? "Đang thuê" : "Đã kết thúc",
                totalFees: paymentHistory.totalAmount || 0,
                paid: paymentHistory.paidAmount || 0,
                remaining: paymentHistory.remainingAmount || 0,
              });
            }
          });
        });

        this.customers = customersData.filter((customer) => {
          const matchHouse =
              !this.selectedHouse || customer.houseName === this.selectedHouse;
          const matchRoom =
              !this.selectedRoom || customer.roomNumber === this.selectedRoom;
          return matchHouse && matchRoom;
        });
      } catch (error) {
        console.error("Lỗi khi tải báo cáo:", error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    getCurrentMonth() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    },
  },
  mounted() {
    try {
      const homes = JSON.parse(localStorage.getItem("homes") || "[]");
      this.houses = homes.map((home) => ({ id: home.id, name: home.name }));
      this.rooms = homes.flatMap((home) =>
          home.rooms.map((room) => ({
            id: room.roomNumber,
            roomNumber: room.roomNumber,
            houseName: home.name,
          }))
      );

      this.fetchReport(); // Tải dữ liệu ngay khi component được gắn
    } catch (error) {
      console.error("Lỗi khi khởi tạo dữ liệu:", error);
    }
  },
};
</script>

<style scoped>
.report-customer-debt {
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
  text-align: left;
}

.table {
  margin-top: 20px;
  font-size: 0.9rem;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.table-responsive {
  margin-top: 15px;
}

.btn-warning {
  color: #fff;
  font-weight: bold;
}
</style>
