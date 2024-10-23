<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Danh sách hợp đồng</h2>
      <!-- Action Buttons -->
      <div>
        <button class="btn btn-success ml-2" @click="addContract"><i class="fas fa-plus"></i> Thêm hợp đồng</button>
        <button class="btn btn-primary ml-2" :disabled="!selectedContract" @click="printContract"><i class="fas fa-print"></i> In hợp đồng</button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="house-select">Nhà</label>
        <select id="house-select" class="form-control" v-model="selectedHouse">
          <option value="all">Tất cả</option>
          <option v-for="house in houses" :key="house.id" :value="house.id">{{ house.name }}</option>
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

    <!-- Contracts Table -->
    <table class="table table-bordered table-hover">
      <thead class="thead-light">
      <tr>
        <th>Nhà</th>
        <th>Phòng</th>
        <th>Mã hợp đồng</th>
        <th>Tên khách thuê</th>
        <th>Ngày bắt đầu</th>
        <th>Ngày kết thúc</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(contract, index) in paginatedContracts" :key="index">
        <td>{{ contract.house }}</td>
        <td>{{ contract.room }}</td>
        <td>{{ contract.contractCode }}</td>
        <td>{{ contract.tenantName }}</td>
        <td>{{ contract.startDate }}</td>
        <td>{{ contract.endDate }}</td>
        <td>
          <button class="btn btn-warning" @click="viewContract(contract)"><i class="fas fa-eye"></i> Xem</button>
          <button class="btn btn-warning" @click="editContract(contract.contractCode)"><i class="fas fa-edit"></i> Sửa</button>
          <button class="btn btn-danger ml-2" @click="deleteContract(contract)"><i class="fas fa-trash"></i> Xóa</button>
        </td>
      </tr>
      <tr v-if="paginatedContracts.length === 0">
        <td colspan="7" class="text-center">Không tìm thấy hợp đồng phù hợp</td>
      </tr>
      </tbody>
    </table>

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

    <!-- Modal for Viewing Contract -->
    <div v-if="selectedContract" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết hợp đồng</h5>
            <button type="button" class="close" @click="closeModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Bên cho thuê -->
            <h5>Bên cho thuê</h5>
            <p><strong>Chủ trọ:</strong> {{ selectedContract.landlordName }}</p>
            <p><strong>Số điện thoại:</strong> {{ selectedContract.landlordPhone }}</p>
            <p><strong>Địa chỉ:</strong> {{ selectedContract.landlordAddress }}</p>
            <hr>
            <!-- Bên thuê -->
            <h5>Bên thuê</h5>
            <p><strong>Tên khách thuê:</strong> {{ selectedContract.tenantName }}</p>
            <p><strong>Ngày bắt đầu:</strong> {{ selectedContract.startDate }}</p>
            <p><strong>Ngày kết thúc:</strong> {{ selectedContract.endDate }}</p>
            <p><strong>Nhà:</strong> {{ selectedContract.house }}</p>
            <p><strong>Phòng:</strong> {{ selectedContract.room }}</p>
            <p><strong>Tiền thuê hàng tháng:</strong> {{ selectedContract.rentalCost }} VND</p>
            <p><strong>Tiền đặt cọc:</strong> {{ selectedContract.deposit }} VND</p>
            <p><strong>Điều khoản hợp đồng:</strong> {{ selectedContract.terms }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="printContract"><i class="fas fa-print"></i> In hợp đồng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedHouse: 'all',
      selectedRoom: 'all',
      itemsPerPage: 10,
      currentPage: 1,
      houses: [], // Danh sách nhà từ localStorage
      rooms: [], // Danh sách phòng từ localStorage
      contracts: [], // Danh sách hợp đồng từ localStorage
      selectedContract: null // Hợp đồng đã chọn để xem chi tiết và in
    };
  },
  computed: {
    filteredRooms() {
      if (this.selectedHouse === 'all') {
        return this.rooms;
      }
      return this.rooms.filter(room => room.houseId === this.selectedHouse);
    },
    filteredContracts() {
      let filtered = this.contracts;
      if (this.selectedHouse !== 'all') {
        filtered = filtered.filter(contract => contract.house === this.houses.find(h => h.id === this.selectedHouse).name);
      }
      if (this.selectedRoom !== 'all') {
        filtered = filtered.filter(contract => contract.room === this.selectedRoom);
      }
      return filtered;
    },
    paginatedContracts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredContracts.slice(start, end);
    },
    totalItems() {
      return this.filteredContracts.length;
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
  mounted() {
    this.loadDataFromLocalStorage(); // Load dữ liệu từ localStorage khi component được mount
  },
  methods: {
    loadDataFromLocalStorage() {
      let storedHomes = localStorage.getItem('homes');
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (storedHomes) {
        let homes = JSON.parse(storedHomes);

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

        // Lấy danh sách hợp đồng và bổ sung thông tin bên cho thuê
        this.contracts = homes.flatMap(home =>
            home.rooms.flatMap(room =>
                room.contract ? {
                  house: home.name,
                  room: room.roomNumber,
                  contractCode: room.contract.contractNumber,
                  tenantName: room.customer ? room.customer.fullName : 'Không có khách',
                  startDate: room.contract.contractDate,
                  endDate: room.contract.contractEndDate || 'Không xác định',
                  rentalCost: room.contract.rentalCost,
                  deposit: room.contract.deposit,
                  terms: room.contract.terms,
                  landlordName: currentUser.name,  // Bên cho thuê: thông tin từ currentUser
                  landlordPhone: currentUser.phone,
                  landlordAddress: currentUser.address
                } : []
            )
        );
      }
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
    addContract() {
      this.$router.push('/landlord/contract-create');
    },
    editContract(contractCode) {
      this.$router.push({ path: '/landlord/contract-create', query: { contractId: contractCode } });
    },
    deleteContract(contract) {
      if (confirm(`Bạn có chắc chắn muốn xóa hợp đồng ${contract.contractCode}?`)) {
        this.contracts = this.contracts.filter(c => c.contractCode !== contract.contractCode);

        // Cập nhật lại localStorage sau khi xóa
        let homes = JSON.parse(localStorage.getItem('homes'));
        homes.forEach(home => {
          home.rooms.forEach(room => {
            if (room.contract && room.contract.contractNumber === contract.contractCode) {
              delete room.contract;
            }
          });
        });
        localStorage.setItem('homes', JSON.stringify(homes));

        alert(`Đã xóa hợp đồng ${contract.contractCode}.`);
      }
    },
    viewContract(contract) {
      this.selectedContract = contract;
    },
    closeModal() {
      this.selectedContract = null;
    },
    printContract() {
      if (!this.selectedContract) return;

      // Nội dung hợp đồng để in
      const contractContent = `
        <h2>Hợp đồng thuê phòng</h2>
        <h4>Bên cho thuê</h4>
        <p><strong>Chủ trọ:</strong> ${this.selectedContract.landlordName}</p>
        <p><strong>Số điện thoại:</strong> ${this.selectedContract.landlordPhone}</p>
        <p><strong>Địa chỉ:</strong> ${this.selectedContract.landlordAddress}</p>
        <hr>
        <h4>Bên thuê</h4>
        <p><strong>Tên khách thuê:</strong> ${this.selectedContract.tenantName}</p>
        <p><strong>Ngày bắt đầu:</strong> ${this.selectedContract.startDate}</p>
        <p><strong>Ngày kết thúc:</strong> ${this.selectedContract.endDate}</p>
        <p><strong>Nhà:</strong> ${this.selectedContract.house}</p>
        <p><strong>Phòng:</strong> ${this.selectedContract.room}</p>
        <p><strong>Tiền thuê hàng tháng:</strong> ${this.selectedContract.rentalCost} VND</p>
        <p><strong>Tiền đặt cọc:</strong> ${this.selectedContract.deposit} VND</p>
        <p><strong>Điều khoản hợp đồng:</strong> ${this.selectedContract.terms}</p>
      `;

      const newWin = window.open('', '', 'width=800,height=600');
      newWin.document.write(contractContent);
      newWin.document.close();
      newWin.print();
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}
</style>
