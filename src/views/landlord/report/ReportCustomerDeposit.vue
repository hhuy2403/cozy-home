<template>
  <div class="container mt-4 report-customer-deposit">
    <h2>Danh sách khách thuê đặt cọc</h2>

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
          <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">
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
          <th>Ngày thuê</th>
          <th>Tiền cọc (VND)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(customer, index) in filteredCustomers" :key="index">
          <td>{{ customer.customerName }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.houseName }}</td>
          <td>{{ customer.roomNumber }}</td>
          <td>{{ customer.bookingDate }}</td>
          <td>{{ formatCurrency(customer.deposit) }}</td>
        </tr>
        <tr v-if="filteredCustomers.length === 0">
          <td colspan="7" class="text-center">Không có dữ liệu</td>
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
      return this.customers.filter((customer) => {
        const matchHouse =
            !this.selectedHouse || customer.houseName === this.selectedHouse;
        const matchRoom =
            !this.selectedRoom || customer.roomNumber === this.selectedRoom;
        return matchHouse && matchRoom;
      });
    },
  },
  methods: {
    fetchReport() {
      try {
        const homes = JSON.parse(localStorage.getItem("homes") || "[]");
        let customersData = [];

        homes.forEach((home) => {
          home.rooms.forEach((room) => {
            room.bookings?.forEach((booking) => {
              customersData.push({
                customerName: booking.customerName,
                address: home.address || "Không có",
                phone: booking.phone || "Không có",
                houseName: home.name,
                roomNumber: room.roomNumber,
                bookingDate: booking.bookingDate || "N/A",
                deposit: booking.deposit || 0,
              });
            });
          });
        });

        this.customers = customersData;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
  mounted() {
    try {
      const homes = JSON.parse(localStorage.getItem("homes") || "[]");
      this.houses = homes.map((home) => ({ id: home.id, name: home.name }));
      this.rooms = homes.flatMap((home) =>
          home.rooms.map((room) => ({
            roomNumber: room.roomNumber,
            houseName: home.name,
          }))
      );

      this.fetchReport(); // Tải dữ liệu khi component được gắn
    } catch (error) {
      console.error("Lỗi khi khởi tạo dữ liệu:", error);
    }
  },
};
</script>

<style scoped>
.report-customer-deposit {
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
