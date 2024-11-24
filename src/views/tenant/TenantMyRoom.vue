<template>
  <div class="my-room container mt-4">
    <h2>Thông tin phòng của bạn</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="roomData">
      <!-- Room and Tenant Details -->
      <div class="room-info card mb-4">
        <div class="card-body">
          <h5 class="card-title">Phòng {{ roomData.roomNumber }}</h5>
          <div class="row">
            <div class="col-md-6">
              <p><strong>Nhà:</strong> {{ roomData.houseName }}</p>
              <p><strong>Địa chỉ:</strong> {{ roomData.houseAddress }}</p>
              <p><strong>Họ và tên:</strong> {{ roomData.customer.fullName }}</p>
              <p><strong>CMND/CCCD:</strong> {{ roomData.customer.identityCard }}</p>
              <p><strong>Điện thoại:</strong> {{ roomData.customer.phoneNumber1 }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Email:</strong> {{ roomData.customer.email }}</p>
              <p><strong>Ngày bắt đầu:</strong> {{ formatDate(roomData.customer.startDate) }}</p>
              <p><strong>Tiền thuê:</strong> {{ formatCurrency(roomData.customer.rentalCost) }}/tháng</p>
              <p><strong>Đặt cọc:</strong> {{ formatCurrency(roomData.customer.deposit) }}</p>
              <p><strong>Kỳ thanh toán:</strong> {{ roomData.customer.paymentCycle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Members -->
      <div class="members card mb-4" v-if="roomData.customer.members?.length">
        <div class="card-body">
          <h5 class="card-title">Thành viên trong phòng</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>CMND/CCCD</th>
                  <th>Điện thoại</th>
                  <th>Địa chỉ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(member, index) in roomData.customer.members" :key="index">
                  <td>{{ member.fullName }}</td>
                  <td>{{ member.identityCard }}</td>
                  <td>{{ member.phoneNumber }}</td>
                  <td>{{ member.address }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="services card mb-4" v-if="roomData.customer.services?.length">
        <div class="card-body">
          <h5 class="card-title">Dịch vụ đăng ký</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in roomData.customer.services" :key="service.id">
                  <td>{{ service.name }}</td>
                  <td>{{ formatCurrency(service.price) }}</td>
                  <td>{{ service.quantity }}</td>
                  <td>{{ formatCurrency(service.price * service.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Contract -->
      <div class="contract card mb-4" v-if="roomData.customer.contracts?.length">
        <div class="card-body">
          <h5 class="card-title">Thông tin hợp đồng</h5>
          <div class="current-contract">
            <p><strong>Số hợp đồng:</strong> {{ currentContract.contractNumber }}</p>
            <p><strong>Ngày bắt đầu:</strong> {{ formatDate(currentContract.contractDate) }}</p>
            <p><strong>Thời hạn:</strong> {{ currentContract.contractDuration }} tháng</p>
            <p><strong>Ngày kết thúc:</strong> {{ formatDate(currentContract.contractEndDate) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin phòng của bạn.
    </div>
  </div>
</template>

<script>

import { crudApi } from '../../apis/crudApi';

export default {
  name: 'TenantMyRoom',
  
  data() {
    return {
      loading: true,
      roomData: null,
    };
  },

  computed: {
    currentContract() {
      if (this.roomData?.customer?.contracts?.length) {
        return this.roomData.customer.contracts[this.roomData.customer.contracts.length - 1];
      }
      return null;
    }
  },

  async mounted() {
    await this.loadRoomData();
  },

  methods: {
    async loadRoomData() {
      try {
        this.loading = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Fetch customers data
        const customersResponse = await crudApi.read('api::customer.customer');
        // const customersResponse = await fetch('https://6725a513c39fedae05b5670b.mockapi.io/api/v1/customers');
        const customers = await customersResponse.json();
        
        // Find customer by email
        const customerData = customers.find(c => c.email === currentUser.email);
        
        if (customerData) {
          // Fetch homes data
          const homesResponse = await crudApi.read('api::home.home');
          // const homesResponse = await fetch('https://6725a513c39fedae05b5670b.mockapi.io/api/v1/homes');
          const homes = await homesResponse.json();
          
          // Find home by houseId
          const home = homes.find(h => h.id === customerData.houseId);
          
          if (home) {
            this.roomData = {
              roomNumber: customerData.roomNumber,
              houseName: home.name,
              houseAddress: `${home.address}, ${home.ward}, ${home.district}, ${home.city}`,
              customer: customerData
            };
          }
        }
      } catch (error) {
        console.error('Error loading room data:', error);
      } finally {
        this.loading = false;
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN').format(date);
    }
  }
};
</script>

<style scoped>
.my-room {
  margin-top: 5em !important;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-title {
  color: #2a3f54;
  font-size: 1.25rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.table {
  margin-bottom: 0;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.alert-warning {
  font-size: 16px;
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
  padding: 15px 20px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  margin: 2rem auto;
}

@media (max-width: 768px) {
  .my-room {
    padding: 15px;
  }
  
  .card-body {
    padding: 15px;
  }
  
  .table-responsive {
    margin: 0 -15px;
  }
}
</style>