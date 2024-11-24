<template>
  <div class="tenant-contract container mt-4">
    <h2>Thông tin hợp đồng thuê nhà</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="contractData">
      <!-- Thông tin chung -->
      <div class="contract-details card mb-4">
        <div class="card-body">
          <h5 class="card-title">Thông tin chung</h5>
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary">Bên cho thuê:</h6>
              <p><strong>Họ tên:</strong> {{ contractData.landlordName }}</p>
              <p><strong>Địa chỉ:</strong> {{ contractData.landlordAddress }}</p>
              <p><strong>Điện thoại:</strong> {{ contractData.landlordPhone }}</p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary">Bên thuê:</h6>
              <p><strong>Họ tên:</strong> {{ contractData.tenantName }}</p>
              <p><strong>CMND/CCCD:</strong> {{ contractData.tenantIdentityCard }}</p>
              <p><strong>Điện thoại:</strong> {{ contractData.tenantPhone }}</p>
              <p><strong>Địa chỉ:</strong> {{ contractData.tenantAddress }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chi tiết hợp đồng -->
      <div class="contract-info card mb-4">
        <div class="card-body">
          <h5 class="card-title">Chi tiết hợp đồng</h5>
          <div class="row">
            <div class="col-md-6">
              <p><strong>Nhà:</strong> {{ houseData?.name }}</p>
              <p><strong>Địa chỉ nhà:</strong> {{ formatAddress(houseData) }}</p>
              <p><strong>Phòng số:</strong> {{ contractData.roomNumber }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Ngày bắt đầu:</strong> {{ formatDate(contractData.startDate) }}</p>
              <p><strong>Ngày kết thúc:</strong> {{ formatDate(contractData.endDate) }}</p>
              <p><strong>Tiền thuê hàng tháng:</strong> {{ formatCurrency(contractData.rentalCost) }}</p>
              <p><strong>Tiền đặt cọc:</strong> {{ formatCurrency(contractData.deposit) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Điều khoản hợp đồng -->
      <div class="contract-terms card mb-4">
        <div class="card-body">
          <h5 class="card-title">Điều khoản hợp đồng</h5>
          <div class="terms-content">
            {{ contractData.terms }}
          </div>
        </div>
      </div>

      <!-- Tải hợp đồng -->
      <div class="text-center mb-4">
        <button class="btn btn-info" @click="downloadContract">
          <i class="fas fa-download"></i> Tải hợp đồng
        </button>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Không tìm thấy thông tin hợp đồng của bạn.
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import crudApi from "@/apis/crudApi";

export default {
  name: 'TenantContract',
  
  data() {
    return {
      loading: true,
      contractData: null,
      houseData: null
    };
  },

  async mounted() {
    await this.loadContractData();
  },

  methods: {
    async loadContractData() {
      try {
        this.loading = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Fetch customer data
        const customersResponse = await crudApi.read("api::customer.customer")
        // const customersResponse = await fetch(`${this.apiBaseUrl}/customers`);
        const customers = await customersResponse.json();
        const customerData = customers.find(c => c.email === currentUser.email);

        if (customerData) {
          // Fetch contract data
          const contractsResponse = await crudApi.read("api::contract.contract")
          // const contractsResponse = await fetch(`${this.apiBaseUrl}/contracts`);
          const contracts = await contractsResponse.json();
          const contract = contracts.find(c => 
            c.tenantName === customerData.fullName && 
            c.roomNumber === customerData.roomNumber
          );

          if (contract) {
            // Fetch house data
            const homesResponse = await crudApi.read("api::home.home")
            // const homesResponse = await fetch(`${this.apiBaseUrl}/homes`);
            const homes = await homesResponse.json();
            this.houseData = homes.find(h => h.id === contract.houseId);
            
            this.contractData = contract;
          }
        }
      } catch (error) {
        console.error('Error loading contract data:', error);
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
      if (!dateString) return 'Không xác định';
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    formatAddress(house) {
      if (!house) return '';
      return `${house.address}, ${house.ward}, ${house.district}, ${house.city}`;
    },

    downloadContract() {
      if (!this.contractData) return;

      const doc = new jsPDF();
      
      // Set font size for title
      doc.setFontSize(18);
      doc.text("HỢP ĐỒNG THUÊ NHÀ", 105, 20, { align: 'center' });

      // Bên cho thuê
      doc.setFontSize(12);
      doc.text("BÊN CHO THUÊ (BÊN A):", 10, 40);
      doc.text(`Họ tên: ${this.contractData.landlordName}`, 20, 50);
      doc.text(`Địa chỉ: ${this.contractData.landlordAddress}`, 20, 60);
      doc.text(`Điện thoại: ${this.contractData.landlordPhone}`, 20, 70);

      // Bên thuê
      doc.text("BÊN THUÊ (BÊN B):", 10, 90);
      doc.text(`Họ tên: ${this.contractData.tenantName}`, 20, 100);
      doc.text(`CMND/CCCD: ${this.contractData.tenantIdentityCard}`, 20, 110);
      doc.text(`Địa chỉ: ${this.contractData.tenantAddress}`, 20, 120);
      doc.text(`Điện thoại: ${this.contractData.tenantPhone}`, 20, 130);

      // Thông tin hợp đồng
      doc.text("NỘI DUNG HỢP ĐỒNG:", 10, 150);
      doc.text(`Phòng số: ${this.contractData.roomNumber}`, 20, 160);
      doc.text(`Địa chỉ: ${this.formatAddress(this.houseData)}`, 20, 170);
      doc.text(`Giá thuê: ${this.formatCurrency(this.contractData.rentalCost)}/tháng`, 20, 180);
      doc.text(`Tiền đặt cọc: ${this.formatCurrency(this.contractData.deposit)}`, 20, 190);
      doc.text(`Thời hạn: ${this.formatDate(this.contractData.startDate)} - ${this.formatDate(this.contractData.endDate)}`, 20, 200);

      // Điều khoản
      doc.text("ĐIỀU KHOẢN:", 10, 220);
      doc.setFontSize(10);
      doc.text(this.contractData.terms, 20, 230, { maxWidth: 170 });

      // Save the PDF
      doc.save(`Hop_dong_thue_nha_${this.contractData.roomNumber}.pdf`);
    }
  }
};
</script>

<style scoped>
.tenant-contract {
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

.terms-content {
  white-space: pre-line;
  line-height: 1.6;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
  color: #fff;
  padding: 10px 20px;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
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
  .tenant-contract {
    padding: 15px;
  }
  
  .card-body {
    padding: 15px;
  }
}
</style>