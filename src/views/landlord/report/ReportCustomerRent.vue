<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="m-0">Danh sách khách thuê phòng</h2>
        <button type="submit" class="btn btn-warning" @click="fetchReport">
          <i class="fas fa-search"></i> Xem
        </button>
      </div>

      <div class="card-body">
        <form @submit.prevent="fetchReport" class="row g-3">
          <div class="col-md-3">
            <label for="startDate" class="form-label">Ngày thuê từ</label>
            <input type="month" id="startDate" class="form-control" v-model="startDate" />
          </div>

          <div class="col-md-3">
            <label for="endDate" class="form-label">Đến</label>
            <input type="month" id="endDate" class="form-control" v-model="endDate" />
          </div>

          <div class="col-md-2">
            <label for="house" class="form-label">Nhà</label>
            <select id="house" class="form-select" v-model="selectedHouse">
              <option value="">Tất cả</option>
              <option v-for="house in houses" :key="house.id" :value="house.name">
                {{ house.name }}
              </option>
            </select>
          </div>

          <div class="col-md-2">
            <label for="room" class="form-label">Phòng</label>
            <select id="room" class="form-select" v-model="selectedRoom">
              <option value="">Tất cả</option>
              <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">
                {{ room.roomNumber }}
              </option>
            </select>
          </div>

          <div class="col-md-2">
            <label for="status" class="form-label">Trạng thái</label>
            <select id="status" class="form-select" v-model="status">
              <option value="">Tất cả</option>
              <option value="active">Đang thuê</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </form>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered mt-3">
          <thead class="table-light">
          <tr>
            <th>Họ tên khách</th>
            <th>CMND/CCCD</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Nhà</th>
            <th>Thuê phòng</th>
            <th>Từ ngày</th>
            <th>Đến ngày</th>
            <th>Ngày hết hạn HD</th>
            <th>Trạng thái</th>
            <th>Đơn giá (VND)</th>
            <th>Tiền cọc (VND)</th>
            <th>Tổng tiền phí (VND)</th>
            <th>Đã trả (VND)</th>
            <th>Còn lại (VND)</th>
            <th>Người giới thiệu</th>
            <th>Ngày sinh</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(customer, index) in filteredCustomers" :key="index">
            <td>{{ customer.fullName }}</td>
            <td>{{ customer.identityCard }}</td>
            <td>{{ customer.address }}</td>
            <td>{{ customer.phoneNumber1 }}</td>
            <td>{{ customer.houseName }}</td>
            <td>{{ customer.roomNumber }}</td>
            <td>{{ customer.startDate }}</td>
            <td>{{ customer.endDate }}</td>
            <td>{{ customer.contractEndDate }}</td>
            <td>{{ customer.status }}</td>
            <td>{{ formatCurrency(customer.price) }}</td>
            <td>{{ formatCurrency(customer.deposit) }}</td>
            <td>{{ formatCurrency(customer.totalAmount) }}</td>
            <td>{{ formatCurrency(customer.paid) }}</td>
            <td>{{ formatCurrency(customer.remainingAmount) }}</td>
            <td>{{ customer.referrer }}</td>
            <td>{{ customer.birthDate }}</td>
          </tr>
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="17" class="text-center">Không có dữ liệu</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      selectedHouse: "",
      selectedRoom: "",
      status: "",
      houses: [],
      rooms: [],
      customers: [],
    };
  },
  computed: {
    filteredRooms() {
      return this.selectedHouse
          ? this.rooms.filter((room) => room.house === this.selectedHouse)
          : this.rooms;
    },
    filteredCustomers() {
      return this.customers.filter((customer) => {
        const startDate = new Date(customer.startDate);
        const endDate = new Date(customer.endDate);
        const filterStartDate = this.startDate ? new Date(this.startDate) : null;
        const filterEndDate = this.endDate ? new Date(this.endDate) : null;

        const matchDate =
            (!filterStartDate || startDate >= filterStartDate) &&
            (!filterEndDate || endDate <= filterEndDate);

        const matchHouse =
            !this.selectedHouse || customer.houseName === this.selectedHouse;

        const matchRoom =
            !this.selectedRoom || customer.roomNumber === this.selectedRoom;

        const matchStatus =
            !this.status || customer.status.toLowerCase() === this.status;

        return matchDate && matchHouse && matchRoom && matchStatus;
      });
    },
  },
  methods: {
    fetchReport() {
      const homes = JSON.parse(localStorage.getItem("homes") || "[]");
      const currentMonth = new Date().toISOString().slice(0, 7);

      this.customers = homes.flatMap((home) =>
          home.rooms
              .filter((room) => room.customer)
              .map((room) => {
                const { customer, contract } = room;
                const paymentHistory = customer.paymentHistory || {};
                const { totalAmount = 0, paidAmount = 0, remainingAmount = 0 } =
                paymentHistory[currentMonth] || {};

                return {
                  fullName: customer.fullName,
                  identityCard: customer.identityCard,
                  address: customer.address,
                  phoneNumber1: customer.phoneNumber1,
                  houseName: home.name,
                  roomNumber: room.roomNumber,
                  startDate: contract.contractDate,
                  endDate: contract.endDate || "",
                  contractEndDate: contract.contractEndDate || "",
                  status: room.isRented ? "Đang thuê" : "Hết hạn",
                  price: room.price,
                  deposit: customer.deposit || 0,
                  totalAmount,
                  paid: paidAmount,
                  remainingAmount,
                  referrer: customer.referral || "",
                  birthDate: customer.birthDate || "",
                };
              })
      );
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
  mounted() {
    const homes = JSON.parse(localStorage.getItem("homes") || "[]");
    this.houses = homes.map((home) => ({
      id: home.id,
      name: home.name,
    }));

    this.rooms = homes.flatMap((home) =>
        home.rooms.map((room) => ({
          roomNumber: room.roomNumber,
          house: home.name,
        }))
    );

    this.fetchReport();
  },
};
</script>

<style scoped>
.container {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #f8f9fa;
}
.table-responsive {
  margin-top: 20px;
}
.table th,
.table td {
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
}
</style>
