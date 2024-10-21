<template>
  <div class="otherfee-create container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-6">
        <h2>Thêm phát sinh</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-warning me-2" @click="goBack">Quay về</button>
        <button class="btn btn-success" @click="saveFee">Lưu</button>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="saveFee">
      <div class="row mb-3">
        <!-- House Selection -->
        <div class="col-md-6">
          <label for="house">Nhà</label>
          <select id="house" v-model="selectedHouse" class="form-select">
            <option value="">Tất cả</option>
            <option v-for="house in houses" :key="house.name" :value="house.name">
              {{ house.name }}
            </option>
          </select>
        </div>

        <!-- Room Selection -->
        <div class="col-md-6">
          <label for="room">Phòng</label>
          <select id="room" v-model="selectedRoom" class="form-select" :disabled="!selectedHouse">
            <option value="">Phòng</option>
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

      <!-- Thông tin bắt buộc -->
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
      houses: [],
      rooms: [],
    };
  },
  computed: {
    filteredRooms() {
      return this.rooms.filter(room => room.house === this.selectedHouse);
    },
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHouses = localStorage.getItem("homes");
      const storedRooms = localStorage.getItem("rooms");

      if (storedHouses) {
        this.houses = JSON.parse(storedHouses);
      }
      if (storedRooms) {
        this.rooms = JSON.parse(storedRooms);
      }
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

      // Construct the room key (e.g., HomeA_room_1)
      const roomKey = `${this.selectedHouse}_room_${this.selectedRoom}`;
      const feeData = {
        monthYear: this.selectedMonthYear,
        amount: this.amount,
        description: this.description,
      };

      // Get room's existing data from localStorage
      const storedRoomData = localStorage.getItem(roomKey);
      let roomData = {};

      if (storedRoomData) {
        roomData = JSON.parse(storedRoomData);
      }

      // Initialize otherFees if it doesn't exist in the room data
      if (!roomData.otherFees) {
        roomData.otherFees = [];
      }

      // Add the new fee to the otherFees array
      roomData.otherFees.push(feeData);

      // Save the updated room data back to localStorage
      localStorage.setItem(roomKey, JSON.stringify(roomData));

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

.input-group-text {
  background-color: #eee;
  border: 1px solid #ced4da;
  padding: 0.375rem 0.75rem;
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
