<template>
  <div class="container mt-4 report-room-person">
    <h2 class="text-left mb-4">Danh sách thành viên theo phòng</h2>

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
      <div class="col-md-3">
        <label for="statusSelect" class="form-label">Giới tính</label>
        <select id="statusSelect" class="form-select" v-model="selectedStatus">
          <option value="">Tất cả</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
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
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Họ tên</th>
          <th>Địa chỉ</th>
          <th>Điện thoại</th>
          <th>CMND</th>
          <th>Ngày sinh</th>
          <th>Giới tính</th>
          <th>Ngày ĐK tạm trú</th>
          <th>Số xe</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(member, index) in filteredMembers" :key="index">
          <td>{{ member.houseName }}</td>
          <td>{{ member.roomNumber }}</td>
          <td>{{ member.fullName }}</td>
          <td>{{ member.address }}</td>
          <td>{{ member.phoneNumber }}</td>
          <td>{{ member.identityCard }}</td>
          <td>{{ member.birthDate }}</td>
          <td>{{ member.gender }}</td>
          <td>{{ member.registrationDate }}</td>
          <td>{{ member.licensePlate }}</td>
        </tr>
        <tr v-if="filteredMembers.length === 0">
          <td colspan="10" class="text-center">Không có dữ liệu</td>
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
      selectedStatus: "",
      houses: [],
      rooms: [],
      members: [],
    };
  },
  computed: {
    filteredRooms() {
      return this.selectedHouse
          ? this.rooms.filter((room) => room.houseName === this.selectedHouse)
          : this.rooms;
    },
    filteredMembers() {
      return this.members.filter((member) => {
        const matchHouse =
            !this.selectedHouse || member.houseName === this.selectedHouse;
        const matchRoom =
            !this.selectedRoom || member.roomNumber === this.selectedRoom;
        const matchStatus =
            !this.selectedStatus || member.gender === this.selectedStatus;
        return matchHouse && matchRoom && matchStatus;
      });
    },
  },
  methods: {
    fetchReport() {
      try {
        const homes = JSON.parse(localStorage.getItem("homes") || "[]");
        let membersData = [];

        homes.forEach((home) => {
          home.rooms.forEach((room) => {
            room.members.forEach((member) => {
              membersData.push({
                houseName: home.name,
                roomNumber: room.roomNumber,
                fullName: member.fullName,
                address: member.address || "Không có",
                phoneNumber: member.phoneNumber || "Không có",
                identityCard: member.identityCard || "Không có",
                birthDate: member.birthDate || "Không có",
                gender: member.gender || "Không xác định",
                registrationDate: member.registrationDate || "Không có",
                licensePlate: member.licensePlate || "Không có",
              });
            });
          });
        });

        this.members = membersData;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
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
.report-room-person {
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
