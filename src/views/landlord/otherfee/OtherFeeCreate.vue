<template>
  <div class="otherfee-create container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Thêm phát sinh</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-warning me-2" @click="goBack"><i class="fas fa-arrow-rotate-left"></i> Quay về</button>
        <button class="btn btn-success" @click="saveFee"><i class="fas fa-save"></i> Lưu</button>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="saveFee">
      <div class="row mb-3">
        <!-- House Selection -->
        <div class="col-md-6">
          <label for="house">Nhà</label>
          <select id="house" v-model="selectedHouse" class="form-select" @change="updateRooms">
            <option value="">Chọn nhà</option>
            <option v-for="house in houses" :key="house.id" :value="house.id">
              {{ house.name }}
            </option>
          </select>
        </div>

        <!-- Room Selection -->
        <div class="col-md-6">
          <label for="room">Phòng</label>
          <select id="room" v-model="selectedRoom" class="form-select" :disabled="!selectedHouse">
            <option value="">Chọn phòng</option>
            <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">
              {{ room.roomNumber }}
            </option>
          </select>
        </div>
      </div>

      <div class="row mb-3">
        <!-- Month/Year Selection -->
        <div class="col-md-6">
          <label for="monthYear">Tháng/năm</label>
          <input type="month" id="monthYear" v-model="selectedMonthYear" class="form-control" />
        </div>

        <!-- Amount Input -->
        <div class="col-md-6">
          <label for="amount">Số tiền</label>
          <div class="input-group">
            <input type="number" id="amount" v-model="amount" class="form-control" min="0" />
            <span class="input-group-text">VND</span>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="row mb-3">
        <div class="col">
          <label for="description">Nội dung</label>
          <textarea id="description" v-model="description" class="form-control"></textarea>
        </div>
      </div>

      <!-- Required Information -->
      <div class="mb-4">
        <span class="text-danger">(*): Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHouse: "",
      selectedRoom: "",
      selectedMonthYear: new Date().toISOString().substring(0, 7),
      amount: 0,
      description: "",
      houses: [], // Stores the list of houses
    };
  },
  computed: {
    filteredRooms() {
      // Filters rooms based on the selected house
      if (this.selectedHouse) {
        const house = this.houses.find(h => h.id === this.selectedHouse);
        return house ? house.rooms : [];
      }
      return [];
    },
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHomes = localStorage.getItem("homes");
      if (storedHomes) {
        this.houses = JSON.parse(storedHomes); // Load the houses and rooms from localStorage
      }
    },
    updateRooms() {
      this.selectedRoom = ""; // Reset room selection when house is changed
    },
    goBack() {
      this.$router.push('/landlord/other-fee');
    },
    saveFee() {
      // Validation check
      if (!this.selectedHouse || !this.selectedRoom || this.amount <= 0 || !this.description) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
      }

      // Find the selected house and room
      const houseIndex = this.houses.findIndex(h => h.id === this.selectedHouse);
      if (houseIndex === -1) {
        alert("Không tìm thấy nhà.");
        return;
      }

      const roomIndex = this.houses[houseIndex].rooms.findIndex(r => r.roomNumber === this.selectedRoom);
      if (roomIndex === -1) {
        alert("Không tìm thấy phòng.");
        return;
      }

      const room = this.houses[houseIndex].rooms[roomIndex];

      // Initialize otherFees array if it doesn't exist in the room object
      if (!room.otherFees) {
        room.otherFees = [];
      }

      // Create a new fee object
      const feeData = {
        monthYear: this.selectedMonthYear,
        amount: this.amount,
        description: this.description,
      };

      // Add the new fee to the room's otherFees array
      room.otherFees.push(feeData);

      // Save the updated homes data back to localStorage
      localStorage.setItem("homes", JSON.stringify(this.houses));

      alert("Phí phát sinh đã được lưu thành công!");
      this.goBack();
    },
  },
};
</script>

<style scoped>
.otherfee-create {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: left;
  font-size: 1.75rem;
  font-weight: bold;
  color: #2a3f54;
}

label {
  font-weight: bold;
}

.form-control, .form-select {
  margin-bottom: 10px;
}

.input-group-text {
  background-color: #eee;
}

.text-danger {
  font-size: 0.875rem;
  margin-top: 10px;
}

.input-group {
  display: flex;
  align-items: center;
}

input.form-control {
  flex: 1;
  border-right: 0;
}

.input-group .form-control, .input-group .form-select {
  margin-bottom: 0;
}
</style>
