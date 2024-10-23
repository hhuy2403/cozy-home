<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Thêm mới</h2>
      <div>
        <button class="btn btn-warning" @click="goBack"><i class="fas fa-arrow-left"></i> Quay về</button>
        <button class="btn btn-success ml-2" @click="saveBooking"><i class="fas fa-save"></i> Lưu</button>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="saveBooking">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="house">Nhà</label>
            <select id="house" class="form-control" v-model="booking.house" @change="updateRooms">
              <option value="all">Tất cả</option>
              <option v-for="house in houses" :key="house.id" :value="house.name">{{ house.name }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="room">Phòng</label>
            <select id="room" class="form-control" v-model="booking.room" required>
              <option value="all">Phòng</option>
              <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="customerName">Họ tên khách</label>
            <input type="text" id="customerName" class="form-control" v-model="booking.customerName" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="bookingDate">Ngày đặt <span class="text-danger">*</span></label>
            <input type="date" id="bookingDate" class="form-control" v-model="booking.bookingDate" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input type="text" id="phone" class="form-control" v-model="booking.phone" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="deposit">Tiền cọc</label>
            <input type="number" id="deposit" class="form-control" v-model="booking.deposit" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="expectedArrival">Ngày dự kiến nhận phòng</label>
            <input type="date" id="expectedArrival" class="form-control" v-model="booking.expectedArrival" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="notes">Ghi chú</label>
            <textarea id="notes" class="form-control" rows="3" v-model="booking.notes"></textarea>
          </div>
        </div>
      </div>
      <div class="form-group">
        <span class="text-danger">(*) Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      booking: {
        house: 'all',
        room: 'all',
        customerName: '',
        bookingDate: '',
        phone: '',
        deposit: 0,
        expectedArrival: '',
        notes: ''
      },
      houses: [], // Data from localStorage
      rooms: []   // Data from localStorage
    };
  },
  computed: {
    filteredRooms() {
      if (this.booking.house === 'all') return [];
      return this.rooms.filter(room => room.houseId === this.houses.find(h => h.name === this.booking.house).id);
    }
  },
  mounted() {
    this.loadDataFromLocalStorage(); // Load data when component mounts
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);

        // Save list of houses and rooms
        this.houses = homes.map(home => ({
          id: home.id,
          name: home.name
        }));

        this.rooms = homes.flatMap(home =>
            home.rooms.map(room => ({
              roomNumber: room.roomNumber,
              houseId: home.id
            }))
        );
      }
    },
    updateRooms() {
      this.booking.room = ''; // Reset selected room when house changes
    },
    saveBooking() {
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);
        const selectedHome = homes.find(home => home.name === this.booking.house);
        const selectedRoom = selectedHome.rooms.find(room => room.roomNumber === this.booking.room);

        // Check if the room is already booked or has a customer
        if (selectedRoom.customer && selectedRoom.customer.fullName) {
          alert(`Phòng ${selectedRoom.roomNumber} nhà ${selectedHome.name} đã có người thuê.`);
          return;
        }

        // Save booking details to the selected room
        if (!selectedRoom.bookings) {
          selectedRoom.bookings = [];
        }
        selectedRoom.bookings.push({
          bookingDate: this.booking.bookingDate,
          customerName: this.booking.customerName,
          phone: this.booking.phone,
          deposit: this.booking.deposit,
          expectedArrival: this.booking.expectedArrival,
          notes: this.booking.notes,
          status: 'Đang giữ chỗ'
        });

        // Save back to localStorage
        localStorage.setItem('homes', JSON.stringify(homes));
        alert('Đặt cọc đã được lưu!');
        this.$router.push('/landlord/booking-index');
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
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

.form-group {
  margin-bottom: 1rem;
}

textarea {
  min-height: 60px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

.text-danger {
  color: red;
}
</style>
