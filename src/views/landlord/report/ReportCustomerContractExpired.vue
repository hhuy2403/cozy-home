<template>
  <div class="container mt-4 report-customer-contract-expired">
    <h2 class="text-left mb-4">
      Danh sách khách sắp hết hợp đồng (trong vòng 30 ngày)
    </h2>

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
          <th>Số HĐ</th>
          <th>Ngày ký</th>
          <th>Ngày hết hạn HĐ</th>
          <th>Số ngày còn lại</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(contract, index) in filteredContracts" :key="index">
          <td>{{ contract.customerName }}</td>
          <td>{{ contract.address }}</td>
          <td>{{ contract.phone }}</td>
          <td>{{ contract.houseName }}</td>
          <td>{{ contract.roomNumber }}</td>
          <td>{{ contract.contractNumber }}</td>
          <td>{{ contract.contractDate }}</td>
          <td>{{ contract.contractEndDate }}</td>
          <td>{{ contract.remainingDays }}</td>
        </tr>
        <tr v-if="filteredContracts.length === 0">
          <td colspan="9" class="text-center">Không có dữ liệu</td>
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
      contracts: [],
    };
  },
  computed: {
    filteredRooms() {
      return this.selectedHouse
          ? this.rooms.filter((room) => room.houseName === this.selectedHouse)
          : this.rooms;
    },
    filteredContracts() {
      return this.contracts.filter((contract) => {
        const matchHouse =
            !this.selectedHouse || contract.houseName === this.selectedHouse;
        const matchRoom =
            !this.selectedRoom || contract.roomNumber === this.selectedRoom;
        return matchHouse && matchRoom;
      });
    },
  },
  methods: {
    fetchReport() {
      try {
        const homes = JSON.parse(localStorage.getItem("homes") || "[]");
        const today = new Date();
        let contractsData = [];

        homes.forEach((home) => {
          home.rooms.forEach((room) => {
            if (room.customer && room.contract) {
              const contractEndDate = new Date(room.contract.contractEndDate);
              const remainingDays = this.calculateRemainingDays(today, contractEndDate);

              if (remainingDays <= 30) {
                contractsData.push({
                  customerName: room.customer.fullName,
                  address: room.customer.address || "Không có",
                  phone: room.customer.phoneNumber1 || "Không có",
                  houseName: home.name,
                  roomNumber: room.roomNumber,
                  contractNumber: room.contract.contractNumber || "N/A",
                  contractDate: room.contract.contractDate || "N/A",
                  contractEndDate: room.contract.contractEndDate || "N/A",
                  remainingDays,
                });
              }
            }
          });
        });

        this.contracts = contractsData;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    },
    calculateRemainingDays(today, endDate) {
      const diffTime = endDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
.report-customer-contract-expired {
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
