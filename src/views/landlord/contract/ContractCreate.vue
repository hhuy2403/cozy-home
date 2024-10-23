<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">{{ isEditing ? 'Sửa hợp đồng' : 'Tạo hợp đồng thuê nhà' }}</h2>
      <div>
        <button class="btn btn-warning" @click="goBack"><i class="fas fa-arrow-left"></i> Quay về</button>
        <button class="btn btn-success ml-2" @click="saveContract"><i class="fas fa-save"></i> {{ isEditing ? 'Cập nhật hợp đồng' : 'Lưu hợp đồng' }}</button>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="saveContract">
      <!-- Thông tin bên cho thuê -->
      <h4>Thông tin bên cho thuê</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="landlordName">Họ tên chủ trọ</label>
            <input type="text" class="form-control" id="landlordName" v-model="contract.landlordName" disabled>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="landlordAddress">Địa chỉ</label>
            <input type="text" class="form-control" id="landlordAddress" v-model="contract.landlordAddress" disabled>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="landlordPhone">Số điện thoại</label>
            <input type="text" class="form-control" id="landlordPhone" v-model="contract.landlordPhone" disabled>
          </div>
        </div>
      </div>

      <!-- Thông tin bên thuê -->
      <h4>Thông tin bên thuê</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="tenantName">Họ tên khách thuê</label>
            <input type="text" class="form-control" id="tenantName" v-model="contract.tenantName" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="tenantIdentityCard">CMND/CCCD</label>
            <input type="text" class="form-control" id="tenantIdentityCard" v-model="contract.tenantIdentityCard" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="tenantPhone">Số điện thoại</label>
            <input type="text" class="form-control" id="tenantPhone" v-model="contract.tenantPhone" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="tenantAddress">Địa chỉ thường trú</label>
            <input type="text" class="form-control" id="tenantAddress" v-model="contract.tenantAddress" required>
          </div>
        </div>
      </div>

      <!-- Thông tin hợp đồng -->
      <h4>Thông tin hợp đồng</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="house">Nhà</label>
            <select id="house" class="form-control" v-model="contract.house" @change="updateRooms">
              <option v-for="house in houses" :key="house.id" :value="house.name">{{ house.name }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="room">Phòng</label>
            <select id="room" class="form-control" v-model="contract.room" required>
              <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="startDate">Ngày bắt đầu</label>
            <input type="date" class="form-control" id="startDate" v-model="contract.startDate" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="endDate">Ngày kết thúc</label>
            <input type="date" class="form-control" id="endDate" v-model="contract.endDate">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="rentalCost">Tiền thuê hàng tháng (VND)</label>
            <input type="number" class="form-control" id="rentalCost" v-model="contract.rentalCost" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="deposit">Tiền đặt cọc (VND)</label>
            <input type="number" class="form-control" id="deposit" v-model="contract.deposit" required>
          </div>
        </div>
      </div>

      <!-- Điều khoản hợp đồng -->
      <h4>Điều khoản hợp đồng</h4>
      <div class="form-group">
        <label for="contractTerms">Nội dung điều khoản</label>
        <textarea class="form-control" id="contractTerms" rows="5" v-model="contract.terms" required></textarea>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false, // Kiểm tra xem có đang chỉnh sửa hợp đồng hay không
      contract: {
        landlordName: '', // Tên chủ trọ từ localStorage
        landlordAddress: '', // Địa chỉ chủ trọ từ localStorage
        landlordPhone: '', // Số điện thoại chủ trọ từ localStorage
        tenantName: '',
        tenantIdentityCard: '',
        tenantPhone: '',
        tenantAddress: '',
        house: '',
        room: '',
        startDate: '',
        endDate: '',
        rentalCost: '',
        deposit: '',
        terms: 'Hợp đồng thuê nhà với các điều khoản ...', // Điều khoản mẫu
      },
      houses: [], // Danh sách nhà từ localStorage
      rooms: [], // Danh sách phòng từ localStorage
    };
  },
  computed: {
    filteredRooms() {
      if (!this.contract.house) return [];
      return this.rooms.filter(room => room.houseId === this.houses.find(h => h.name === this.contract.house).id);
    }
  },
  mounted() {
    this.loadDataFromLocalStorage();

    const contractId = this.$route.query.contractId;
    if (contractId) {
      this.isEditing = true;
      this.loadContract(contractId); // Tải hợp đồng để chỉnh sửa
    }
  },
  methods: {
    loadDataFromLocalStorage() {
      const storedHomes = localStorage.getItem('homes');
      const currentUser = localStorage.getItem('currentUser');
      if (storedHomes && currentUser) {
        const homes = JSON.parse(storedHomes);
        const landlord = JSON.parse(currentUser);

        // Lưu thông tin chủ trọ
        this.contract.landlordName = landlord.name;
        this.contract.landlordAddress = landlord.address;
        this.contract.landlordPhone = landlord.phone;

        // Lưu danh sách nhà và phòng
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
    loadContract(contractId) {
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);

        homes.forEach(home => {
          home.rooms.forEach(room => {
            if (room.contract && room.contract.contractNumber == contractId) {
              // Tải thông tin hợp đồng vào form
              this.contract.house = home.name;
              this.contract.room = room.roomNumber;
              this.contract.startDate = room.contract.contractDate;
              this.contract.endDate = room.contract.contractEndDate;
              this.contract.rentalCost = room.contract.rentalCost;
              this.contract.deposit = room.contract.deposit;
              this.contract.terms = room.contract.terms;
              this.contract.tenantName = room.customer.fullName;
              this.contract.tenantIdentityCard = room.customer.identityCard;
              this.contract.tenantPhone = room.customer.phoneNumber1;
              this.contract.tenantAddress = room.customer.address;
            }
          });
        });
      }
    },
    updateRooms() {
      this.contract.room = ''; // Reset khi chọn nhà khác
    },
    saveContract() {
      const storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        const homes = JSON.parse(storedHomes);

        const selectedHome = homes.find(home => home.name === this.contract.house);
        const selectedRoom = selectedHome.rooms.find(room => room.roomNumber === this.contract.room);

        // Cảnh báo nếu phòng đã có người thuê và có hợp đồng
        if (selectedRoom.customer && selectedRoom.contract && !this.isEditing) {
          alert(`Phòng ${selectedRoom.roomNumber} nhà ${selectedHome.name} đã có người thuê.`);
          return;
        }

        // Lưu thông tin hợp đồng vào phòng
        selectedRoom.contract = {
          contractNumber: this.isEditing ? selectedRoom.contract.contractNumber : Date.now(), // Số hợp đồng
          contractDate: this.contract.startDate,
          contractEndDate: this.contract.endDate,
          rentalCost: this.contract.rentalCost,
          deposit: this.contract.deposit,
          terms: this.contract.terms
        };

        // Lưu lại thông tin khách thuê
        selectedRoom.customer = {
          fullName: this.contract.tenantName,
          identityCard: this.contract.tenantIdentityCard,
          phoneNumber1: this.contract.tenantPhone,
          address: this.contract.tenantAddress
        };

        // Cập nhật lại homes trong localStorage
        localStorage.setItem('homes', JSON.stringify(homes));

        alert(this.isEditing ? 'Hợp đồng đã được cập nhật!' : 'Hợp đồng đã được lưu!');
        this.$router.push('/landlord/contract-index');
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

h4 {
  margin-top: 20px;
}

textarea {
  min-height: 100px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}
</style>
