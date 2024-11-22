<template>
  <div class="contract-form">
    <!-- Header Section -->
    <div class="form-header">
      <div class="header-title">
        <i class="fas fa-file-contract"></i>
        <h1>{{ isEditing ? 'Sửa hợp đồng' : 'Thêm hợp đồng' }}</h1>
      </div>
      <div class="header-actions">
        <button class="action-btn back-btn" @click="goBack" :disabled="isSaving">
          <i class="fas fa-arrow-left"></i>
          <span>Quay về</span>
        </button>
        <button class="action-btn save-btn" type="submit" form="contractForm" :disabled="isSaving || isLoading">
          <template v-if="isSaving">
            <div class="spinner"></div>
            <span>{{ isEditing ? 'Đang cập nhật...' : 'Đang lưu...' }}</span>
          </template>
          <template v-else>
            <i class="fas fa-save"></i>
            <span>{{ isEditing ? 'Cập nhật' : 'Lưu' }}</span>
          </template>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>

    <!-- Form Content -->
    <form v-else id="contractForm" @submit.prevent="saveContract" class="form-content">
      <div class="form-grid">
        <!-- Landlord Info Section -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-user-tie"></i>
            Bên cho thuê
          </h2>
          <div class="input-group">
            <label>Họ tên chủ trọ</label>
            <input type="text" v-model="contract.landlordName" disabled>
          </div>
          <div class="input-group">
            <label>Địa chỉ</label>
            <input type="text" v-model="contract.landlordAddress" disabled>
          </div>
          <div class="input-group">
            <label>Số điện thoại</label>
            <input type="text" v-model="contract.landlordPhone" disabled>
          </div>
        </div>

        <!-- Tenant Info Section -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-user"></i>
            Bên thuê
          </h2>
          <div class="input-group required">
            <label>Họ tên người thuê</label>
            <input type="text" v-model="contract.tenantName" placeholder="Nhập họ tên người thuê">
          </div>
          <div class="input-group required">
            <label>CMND/CCCD</label>
            <input type="text" v-model="contract.tenantIdentityCard" placeholder="Nhập số CMND/CCCD">
          </div>
          <div class="input-grid">
            <div class="input-group required">
              <label>Số điện thoại</label>
              <input type="tel" v-model="contract.tenantPhone" placeholder="Nhập số điện thoại">
            </div>
            <div class="input-group required">
              <label>Địa chỉ thường trú</label>
              <input type="text" v-model="contract.tenantAddress" placeholder="Nhập địa chỉ">
            </div>
          </div>
        </div>

        <!-- Contract Details Section -->
        <div class="form-section">
          <h2 class="section-title">
            <i class="fas fa-home"></i>
            Chi tiết hợp đồng
          </h2>
          <div class="input-grid">
            <div class="input-group required">
              <label>Nhà</label>
              <select v-model="contract.houseId" @change="updateRooms">
                <option value="">Chọn nhà</option>
                <option v-for="house in houses" :key="house.id" :value="house.id">
                  {{ house.name }}
                </option>
              </select>
            </div>
            <div class="input-group required">
              <label>Phòng</label>
              <select v-model="contract.roomNumber" :disabled="!contract.houseId">
                <option value="">Chọn phòng</option>
                <option v-for="room in filteredRooms" :key="room.id" :value="room.roomNumber">
                  {{ room.roomNumber }}
                </option>
              </select>
            </div>
          </div>

          <div class="input-grid">
            <div class="input-group required">
              <label>Ngày bắt đầu</label>
              <input type="date" v-model="contract.startDate">
            </div>
            <div class="input-group">
              <label>Ngày kết thúc</label>
              <input type="date" v-model="contract.endDate">
            </div>
          </div>

          <div class="input-grid">
            <div class="input-group required">
              <label>Tiền thuê hàng tháng (VND)</label>
              <input type="number" v-model="contract.rentalCost" placeholder="Tự động cập nhật theo phòng"
                :readonly="!contract.roomNumber" disabled>
            </div>
            <div class="input-group required">
              <label>Tiền đặt cọc (VND)</label>
              <input type="number" v-model="contract.deposit" placeholder="Nhập số tiền">
            </div>
          </div>
        </div>

        <!-- Terms Section -->
        <div class="form-section full-width">
          <h2 class="section-title">
            <i class="fas fa-file-alt"></i>
            Điều khoản hợp đồng
          </h2>
          <div class="input-group">
            <textarea v-model="contract.terms" rows="5" placeholder="Nhập nội dung điều khoản..."></textarea>
          </div>
        </div>
      </div>

      <div class="required-note">
        <span class="required-star">*</span> Thông tin bắt buộc
      </div>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

const API_URL = 'https://6725a513c39fedae05b5670b.mockapi.io/api/v1';

export default {
  data() {
    return {
      isEditing: false,
      isLoading: false,
      isSaving: false,
      contract: {
        id: null,
        landlordName: '',
        landlordAddress: '',
        landlordPhone: '',
        tenantName: '',
        tenantIdentityCard: '',
        tenantPhone: '',
        tenantAddress: '',
        houseId: '',
        houseName: '',
        roomNumber: '',
        startDate: '',
        endDate: '',
        rentalCost: '',
        deposit: '',
        terms: 'Hợp đồng thuê nhà với các điều khoản...',
        status: 'active',
        userId: '',
        createdAt: '',
        updatedAt: ''
      },
      houses: [],
      rooms: []
    };
  },

  computed: {
    filteredRooms() {
      if (!this.contract.houseId) return [];
      return this.rooms.filter(room => room.houseId === this.contract.houseId);
    }
  },

  async created() {
    const contractId = this.$route.params.id;
    this.isEditing = !!contractId;

    await this.loadInitialData(contractId);
  },

  watch: {
    'contract.roomNumber': {
      async handler(newRoomNumber) {
        if (newRoomNumber && this.contract.houseId) {
          await this.updateRoomPrice(newRoomNumber);
        }
      }
    }
  },

  methods: {
    async updateRoomPrice(roomNumber) {
      try {
        const room = this.rooms.find(r =>
          r.roomNumber === roomNumber &&
          r.houseId === this.contract.houseId
        );

        if (room) {
          // Chỉ cập nhật tiền thuê hàng tháng
          this.contract.rentalCost = room.price || 0;
        }
      } catch (error) {
        console.error('Error updating room price:', error);
      }
    },
    async loadInitialData(contractId) {
      try {
        this.isLoading = true;
        await this.loadLandlordInfo();
        await this.loadHouses();

        if (this.isEditing) {
          await this.loadContract(contractId);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        Swal.fire('Lỗi', 'Không thể tải dữ liệu', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async loadLandlordInfo() {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
          throw new Error('User not found');
        }

        // Lấy thông tin chi tiết từ landlord-info endpoint
        const response = await fetch(`${API_URL}/landlord-info?userId=${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to load landlord info');

        const landlordInfoList = await response.json();
        const landlordInfo = landlordInfoList[0]; // Lấy thông tin đầu tiên từ array

        if (!landlordInfo) {
          throw new Error('Landlord info not found');
        }

        // Cập nhật thông tin contract từ landlordInfo
        this.contract.userId = currentUser.id;
        this.contract.landlordName = landlordInfo.personalInfo.name;
        this.contract.landlordPhone = landlordInfo.personalInfo.phone;

        // Tạo địa chỉ đầy đủ từ thông tin trong personalInfo
        this.contract.landlordAddress = landlordInfo.personalInfo.address;

        // Load houses sau khi có userId
        await this.loadHouses();
      } catch (error) {
        console.error('Error loading landlord info:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin chủ trọ. Vui lòng đăng nhập lại.',
          confirmButtonText: 'OK'
        });
        this.$router.push('/login');
      }
    },

    async loadHouses() {
      try {
        const response = await fetch(`${API_URL}/homes?landlordId=${this.contract.userId}`);
        if (!response.ok) throw new Error('Failed to load houses');
        this.houses = await response.json();
      } catch (error) {
        console.error('Error loading houses:', error);
        throw error;
      }
    },

    async loadRooms(houseId) {
      try {
        const response = await fetch(`${API_URL}/rooms?houseId=${houseId}&isRented=false`);
        if (!response.ok) throw new Error('Failed to load rooms');
        this.rooms = await response.json();
      } catch (error) {
        console.error('Error loading rooms:', error);
        throw error;
      }
    },

    async loadContract(contractId) {
      try {
        const response = await fetch(`${API_URL}/contracts/${contractId}`);
        if (!response.ok) throw new Error('Failed to load contract');
        const contractData = await response.json();

        // Merge contract data with current contract state
        this.contract = { ...this.contract, ...contractData };

        // Load related rooms after loading house
        if (this.contract.houseId) {
          await this.loadRooms(this.contract.houseId);
        }
      } catch (error) {
        console.error('Error loading contract:', error);
        throw error;
      }
    },

    async updateRooms() {
      try {
        this.contract.roomNumber = '';
        this.contract.rentalCost = ''; // Reset giá thuê

        if (this.contract.houseId) {
          await this.loadRooms(this.contract.houseId);
        }
      } catch (error) {
        console.error('Error updating rooms:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật danh sách phòng',
          confirmButtonText: 'OK'
        });
      }
    },

    validateForm() {
      if (!this.contract.tenantName.trim()) {
        Swal.fire('Lỗi', 'Vui lòng nhập tên người thuê', 'error');
        return false;
      }
      if (!this.contract.tenantIdentityCard.trim()) {
        Swal.fire('Lỗi', 'Vui lòng nhập CMND/CCCD', 'error');
        return false;
      }
      if (!this.contract.houseId) {
        Swal.fire('Lỗi', 'Vui lòng chọn nhà', 'error');
        return false;
      }
      if (!this.contract.roomNumber) {
        Swal.fire('Lỗi', 'Vui lòng chọn phòng', 'error');
        return false;
      }
      if (!this.contract.startDate) {
        Swal.fire('Lỗi', 'Vui lòng chọn ngày bắt đầu', 'error');
        return false;
      }
      return true;
    },

    async saveContract() {
      if (!this.validateForm()) return;

      try {
        this.isSaving = true;

        // Lưu contract
        const contractData = {
          ...this.contract,
          updatedAt: new Date().toISOString()
        };

        if (!this.isEditing) {
          contractData.createdAt = new Date().toISOString();
        }

        const url = this.isEditing
          ? `${API_URL}/contracts/${this.contract.id}`
          : `${API_URL}/contracts`;

        const contractResponse = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contractData)
        });

        if (!contractResponse.ok) throw new Error('Failed to save contract');

        const savedContract = await contractResponse.json();

        // Tìm room ID từ roomNumber và houseId
        const room = this.rooms.find(r => r.roomNumber === this.contract.roomNumber
          && r.houseId === this.contract.houseId);

        if (!room) throw new Error('Room not found');

        // Tính số tháng hợp đồng
        const contractDuration = this.contract.endDate ?
          Math.ceil((new Date(this.contract.endDate) - new Date(this.contract.startDate)) / (1000 * 60 * 60 * 24 * 30)) : 12;

        // Lưu customer
        const customerData = {
          fullName: this.contract.tenantName,
          identityCard: this.contract.tenantIdentityCard,
          phoneNumber1: this.contract.tenantPhone,
          address: this.contract.tenantAddress,
          roomNumber: this.contract.roomNumber,
          startDate: this.contract.startDate,
          rentalCost: Number(this.contract.rentalCost),
          deposit: Number(this.contract.deposit),
          contracts: [{
            contractNumber: savedContract.id,
            contractDate: this.contract.startDate,
            contractDuration: contractDuration,
            contractEndDate: this.contract.endDate || ''
          }],
          // Các trường mặc định theo schema
          gender: '',
          phoneNumber2: '',
          email: '',
          birthDate: '',
          paymentCycle: 'monthly',
          paymentFrequency: 1,
          licensePlate: '',
          referral: '',
          notes: '',
          image: '',
          members: [],
          services: [],
          // Thông tin liên kết
          roomId: room.id,
          houseId: this.contract.houseId,
          phoneNumber: this.contract.tenantPhone,
          lastUpdated: new Date().toISOString()
        };

        const customerResponse = await fetch(`${API_URL}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });

        if (!customerResponse.ok) throw new Error('Failed to save customer');

        // Update room status
        const roomUpdateResponse = await fetch(`${API_URL}/rooms/${room.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...room,
            isRented: true,
            currentContract: savedContract.id,
            currentTenant: this.contract.tenantName
          })
        });

        if (!roomUpdateResponse.ok) throw new Error('Failed to update room status');

        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: `Hợp đồng đã được ${this.isEditing ? 'cập nhật' : 'lưu'}!`,
          confirmButtonText: 'OK'
        });

        this.$router.push('/landlord/contract-index');
      } catch (error) {
        console.error('Error saving contract:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Không thể ${this.isEditing ? 'cập nhật' : 'lưu'} hợp đồng. ${error.message}`,
          confirmButtonText: 'OK'
        });
      } finally {
        this.isSaving = false;
      }
    },

    async updateRoomStatus() {
      try {
        const room = this.rooms.find(r => r.roomNumber === this.contract.roomNumber
          && r.houseId === this.contract.houseId);
        if (!room) throw new Error('Room not found');

        const response = await fetch(`${API_URL}/rooms/${room.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isRented: true,
            customer: {
              fullName: this.contract.tenantName,
              identityCard: this.contract.tenantIdentityCard,
              phoneNumber1: this.contract.tenantPhone,
              address: this.contract.tenantAddress
            },
            contracts: [{
              contractNumber: this.contract.id,
              contractDate: this.contract.startDate,
              contractEndDate: this.contract.endDate,
              rentalCost: this.contract.rentalCost,
              deposit: this.contract.deposit,
              terms: this.contract.terms
            }]
          })
        });

        if (!response.ok) throw new Error('Failed to update room status');
      } catch (error) {
        console.error('Error updating room status:', error);
        throw error;
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.contract-form {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Header Styles */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title i {
  font-size: 1.75rem;
  color: #3b82f6;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Action Buttons */
.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn {
  background: #f1f5f9;
  color: #475569;
}

.save-btn {
  background: #22c55e;
  color: white;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  color: #334155;
  margin-bottom: 1.25rem;
}

/* Input Styles */
.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.375rem;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

/* Required Fields */
.required label::after {
  content: ' *';
  color: #ef4444;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contract-form {
    margin: 1rem;
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>