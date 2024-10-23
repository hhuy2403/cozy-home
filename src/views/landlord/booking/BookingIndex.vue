<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Cọc giữ phòng</h2>
      <div>
        <button class="btn btn-success ml-2" @click="addBooking"><i class="fas fa-plus"></i> Thêm mới</button>
        <button class="btn btn-primary ml-2" @click="exportToExcel"><i class="fas fa-file-excel"></i> Xuất file excel</button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="fromDate">Từ ngày</label>
        <input type="date" id="fromDate" class="form-control" v-model="fromDate">
      </div>
      <div class="col-md-3">
        <label for="toDate">Đến</label>
        <input type="date" id="toDate" class="form-control" v-model="toDate">
      </div>
      <div class="col-md-3">
        <label for="house-select">Nhà</label>
        <select id="house-select" class="form-control" v-model="selectedHouse">
          <option value="all">Tất cả</option>
          <option v-for="house in houses" :key="house.id" :value="house.name">{{ house.name }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="room-select">Phòng</label>
        <select id="room-select" class="form-control" v-model="selectedRoom">
          <option value="all">Phòng</option>
          <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
        </select>
      </div>
    </div>

    <!-- Booking Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="thead-light">
        <tr>
          <th>Ngày đặt</th>
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Họ tên</th>
          <th>SDT</th>
          <th>Tiền cọc</th>
          <th>Ngày dự kiến đến</th>
          <th>Trạng thái</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(booking, index) in paginatedBookings" :key="index">
          <td>{{ booking.bookingDate }}</td>
          <td>{{ booking.house }}</td>
          <td>{{ booking.room }}</td>
          <td>{{ booking.customerName }}</td>
          <td>{{ booking.phone }}</td>
          <td>{{ booking.deposit }}</td>
          <td>{{ booking.expectedArrival }}</td>
          <td>{{ booking.status }}</td>
        </tr>
        <tr v-if="paginatedBookings.length === 0">
          <td colspan="8" class="text-center">Không tìm thấy dòng nào phù hợp</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between">
      <div>
        Đang xem {{ startItem }} đến {{ endItem }} trong tổng số {{ totalItems }} mục
      </div>
      <div>
        <button class="btn btn-light" :disabled="currentPage === 1" @click="previousPage">Trước</button>
        <button class="btn btn-light" :disabled="currentPage === totalPages" @click="nextPage">Tiếp</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'; // Library for exporting to Excel

export default {
  data() {
    return {
      fromDate: '',
      toDate: '',
      selectedHouse: 'all',
      selectedRoom: 'all',
      itemsPerPage: 20,
      currentPage: 1,
      houses: [], // Load from localStorage
      rooms: [], // Load from localStorage
      bookings: [] // Load from localStorage or API
    };
  },
  computed: {
    filteredRooms() {
      if (this.selectedHouse === 'all') return this.rooms;
      return this.rooms.filter(room => room.houseId === this.houses.find(h => h.name === this.selectedHouse).id);
    },
    filteredBookings() {
      let filtered = this.bookings;

      if (this.selectedHouse !== 'all') {
        filtered = filtered.filter(booking => booking.house === this.selectedHouse);
      }
      if (this.selectedRoom !== 'all') {
        filtered = filtered.filter(booking => booking.room === this.selectedRoom);
      }

      if (this.fromDate && this.toDate) {
        filtered = filtered.filter(booking =>
            new Date(booking.bookingDate) >= new Date(this.fromDate) &&
            new Date(booking.bookingDate) <= new Date(this.toDate)
        );
      }
      return filtered;
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBookings.slice(start, end);
    },
    totalItems() {
      return this.filteredBookings.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    }
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);

        // Load houses and rooms from localStorage
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

        // Load bookings from rooms
        this.bookings = homes.flatMap(home =>
            home.rooms.flatMap(room =>
                room.bookings?.map(booking => ({
                  house: home.name,
                  room: room.roomNumber,
                  ...booking // Spread booking details (customerName, phone, etc.)
                })) || []
            )
        );
      }
    },
    addBooking() {
      // Navigate to booking creation page
      this.$router.push('/landlord/booking-create');
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.filteredBookings);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
      XLSX.writeFile(workbook, 'Danh_sach_coc_giu_phong.xlsx');
    }
  },
  mounted() {
    this.loadDataFromLocalStorage(); // Load data from localStorage when the component mounts
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

.table {
  margin-top: 20px;
}

thead {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: space-between;
}

.btn {
  margin-right: 10px;
}

.btn-light {
  margin-left: 5px;
}
</style>
