<template>
  <div class="create-customer">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Thêm khách thuê phòng</h2>
      <div>
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>
        <button class="btn btn-success" @click="saveCustomer">
          <i class="fa fa-check"></i> Lưu
        </button>
      </div>
    </div>

    <form>
      <!-- Tabs for Navigation -->
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <a
              class="nav-link"
              :class="{ active: activeTab === 'customer-info' }"
              @click.prevent="setActiveTab('customer-info')"
              role="tab"
          >
            Thông tin khách thuê
          </a>
        </li>
        <li class="nav-item">
          <a
              class="nav-link"
              :class="{ active: activeTab === 'service' }"
              @click.prevent="setActiveTab('service')"
              role="tab"
          >
            Dịch vụ
          </a>
        </li>
        <li class="nav-item">
          <a
              class="nav-link"
              :class="{ active: activeTab === 'member' }"
              @click.prevent="setActiveTab('member')"
              role="tab"
          >
            Thành viên
          </a>
        </li>
        <li class="nav-item">
          <a
              class="nav-link"
              :class="{ active: activeTab === 'contract' }"
              @click.prevent="setActiveTab('contract')"
              role="tab"
          >
            Hợp đồng
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Customer Info Tab -->
        <div
            class="tab-pane fade"
            :class="{ active: activeTab === 'customer-info', show: activeTab === 'customer-info' }"
            id="customer-info"
            role="tabpanel"
        >
          <!-- Form Fields -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="fullName" class="form-label">Họ và tên *</label>
              <input type="text" v-model="customer.fullName" id="fullName" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="identityCard" class="form-label">CMND/CCCD</label>
              <input type="text" v-model="customer.identityCard" id="identityCard" class="form-control" />
            </div>
          </div>

          <!-- Gender and Phone Numbers -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giới tính *</label>
              <div>
                <input type="radio" v-model="customer.gender" id="male" value="Nam" />
                <label for="male" class="me-3">Nam</label>
                <input type="radio" v-model="customer.gender" id="female" value="Nữ" />
                <label for="female">Nữ</label>
              </div>
            </div>
            <div class="col-md-6">
              <label for="phoneNumber1" class="form-label">Điện thoại 1 *</label>
              <input type="text" v-model="customer.phoneNumber1" id="phoneNumber1" class="form-control" />
            </div>
          </div>

          <!-- Second Phone and Address -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="phoneNumber2" class="form-label">Điện thoại 2</label>
              <input type="text" v-model="customer.phoneNumber2" id="phoneNumber2" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="address" class="form-label">Địa chỉ thường trú</label>
              <input type="text" v-model="customer.address" id="address" class="form-control" />
            </div>
          </div>

          <!-- Date of Birth and Email -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="birthDate" class="form-label">Ngày sinh (dd/MM/yyyy)</label>
              <input type="date" v-model="customer.birthDate" id="birthDate" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="customer.email" id="email" class="form-control" />
            </div>
          </div>

          <!-- Renting Room and Start Date -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="roomNumber" class="form-label">Thuê phòng số *</label>
              <input type="text" v-model="customer.roomNumber" id="roomNumber" class="form-control" readonly/>
            </div>
            <div class="col-md-6">
              <label for="startDate" class="form-label">Ngày bắt đầu *</label>
              <input type="date" v-model="customer.startDate" id="startDate" class="form-control" />
            </div>
          </div>

          <!-- Rental Cost and Deposit -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="rentalCost" class="form-label">Tiền phòng *</label>
              <div class="input-group">
                <input
                    type="text"
                    v-model="customer.rentalCost"
                    id="rentalCost"
                    class="form-control"
                    @input="formatCurrency('rentalCost')"
                    @blur="updateValue('rentalCost')"
                />
                <span class="input-group-text">VNĐ</span>
              </div>
            </div>
            <div class="col-md-6">
              <label for="deposit" class="form-label">Đặt cọc *</label>
              <div class="input-group">
                <input
                    type="text"
                    v-model="customer.deposit"
                    id="deposit"
                    class="form-control"
                    @input="formatCurrency('deposit')"
                    @blur="updateValue('deposit')"
                />
                <span class="input-group-text">VNĐ</span>
              </div>
            </div>
          </div>

          <!-- Payment Cycle and Payment Frequency (with "tháng" label) -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="paymentCycle" class="form-label">Kỳ thanh toán *</label>
              <select v-model="customer.paymentCycle" id="paymentCycle" class="form-select">
                <option value="Kỳ 30">Kỳ 30</option>
                <option value="Kỳ 60">Kỳ 60</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="paymentFrequency" class="form-label">Thanh toán mỗi lần *</label>
              <div class="input-group">
                <input type="number" v-model="customer.paymentFrequency" id="paymentFrequency" class="form-control" />
                <span class="input-group-text">Tháng</span>
              </div>
            </div>
          </div>

          <!-- Additional Fields (License Plate, Referral, Notes, Image) -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="licensePlate" class="form-label">Số xe</label>
              <input type="text" v-model="customer.licensePlate" id="licensePlate" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="referral" class="form-label">Người giới thiệu</label>
              <input type="text" v-model="customer.referral" id="referral" class="form-control" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="notes" class="form-label">Ghi chú khác</label>
              <textarea v-model="customer.notes" id="notes" class="form-control"></textarea>
            </div>
            <div class="col-md-6">
              <label for="image" class="form-label">Hình ảnh</label>
              <input type="file" @change="onFileChange" class="form-control" />
              <img v-if="customer.image" :src="customer.image" class="img-thumbnail mt-2" alt="" />
            </div>
          </div>
        </div>

        <!-- Service Tab -->
        <div class="tab-pane fade" :class="{ active: activeTab === 'service', show: activeTab === 'service' }" id="service" role="tabpanel">
          <div class="alert alert-info">
            <strong>Lưu ý:</strong> Vui lòng chọn dịch vụ cho khách thuê. Nếu khách có chọn dịch vụ thì phần mềm sẽ tự
            động tính các khoản phí vào hóa đơn. Đối với dịch vụ là loại điện/ nước thì sẽ tính theo chỉ số điện/ nước.
          </div>
          <table class="table table-bordered">
            <thead>
            <tr>
              <th>Chọn</th>
              <th>Dịch vụ sử dụng</th>
              <th>Đơn giá (VNĐ)</th>
              <th>Số lượng</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(service, index) in services" :key="index">
              <td><input type="checkbox" v-model="service.selected" /></td>
              <td>{{ service.name }}</td>
              <td>
                <div class="input-group">
                  <input type="text" v-model="services[index].price" class="form-control" @input="formatCurrency(index)" />
                  <span class="input-group-text">VNĐ</span>
                </div>
              </td>
              <td><input type="number" v-model="service.quantity" class="form-control" min="1" /></td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Member Tab -->
        <div class="tab-pane fade" :class="{ active: activeTab === 'member', show: activeTab === 'member' }" id="member" role="tabpanel">
          <table class="table table-bordered">
            <thead>
            <tr>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>CMND/CCCD</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Số xe</th>
              <th>Ngày ĐKTT</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(member, index) in members" :key="index">
              <td><input type="text" v-model="member.fullName" class="form-control" /></td>
              <td><input type="date" v-model="member.birthDate" class="form-control" /></td>
              <td>
                <div>
                  <input type="radio" v-model="member.gender" :value="'Nam'" /> Nam
                  <input type="radio" v-model="member.gender" :value="'Nữ'" /> Nữ
                </div>
              </td>
              <td><input type="text" v-model="member.identityCard" class="form-control" /></td>
              <td><input type="text" v-model="member.address" class="form-control" /></td>
              <td><input type="text" v-model="member.phoneNumber" class="form-control" /></td>
              <td><input type="text" v-model="member.licensePlate" class="form-control" /></td>
              <td><input type="date" v-model="member.registrationDate" class="form-control" /></td>
              <td><button class="btn btn-danger" @click="removeMember(index)">Xóa</button></td>
            </tr>
            </tbody>
          </table>
          <button class="btn btn-success" @click.prevent="addMember">Thêm thành viên</button>
        </div>

        <!-- Contract Tab -->
        <div
            class="tab-pane fade"
            :class="{ active: activeTab === 'contract', show: activeTab === 'contract' }"
            id="contract"
            role="tabpanel"
        >
          <div class="alert alert-info">Các thông tin nhập ở đây sẽ được sử dụng cho việc xuất/in hợp đồng thuê phòng.</div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="contractNumber" class="form-label">Số hợp đồng</label>
              <input type="text" v-model="contract.contractNumber" id="contractNumber" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="contractDate" class="form-label">Ngày hợp đồng</label>
              <input type="date" v-model="contract.contractDate" id="contractDate" class="form-control" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="contractDuration" class="form-label">Thời gian HĐ</label>
              <div class="input-group">
                <input type="number" v-model="contract.contractDuration" id="contractDuration" class="form-control" min="0" />
                <span class="input-group-text">Tháng</span>
              </div>
            </div>
            <div class="col-md-6">
              <label for="contractEndDate" class="form-label">Ngày kết thúc HĐ</label>
              <input type="date" v-model="contract.contractEndDate" id="contractEndDate" class="form-control" />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'customer-info',
      customer: {
        fullName: '',
        identityCard: '',
        phoneNumber1: '',
        phoneNumber2: '',
        email: '',
        birthDate: '',
        address: '',
        roomNumber: '',
        startDate: '',
        rentalCost: '',
        deposit: '',
        paymentCycle: 'Kỳ 30',
        paymentFrequency: 1,
        licensePlate: '',
        referral: '',
        notes: '',
        image: null,
      },
      contract: {
        contractNumber: '',
        contractDate: '',
        contractDuration: 0,
        contractEndDate: '',
      },
      services: [
        { name: 'Điện', price: 3000, quantity: 1, selected: true },
        { name: 'Nước', price: 20000, quantity: 1, selected: true },
        { name: 'Gửi xe máy', price: 80000, quantity: 1, selected: true },
        { name: 'Rác', price: 50000, quantity: 1, selected: true },
      ],
      members: [
        {
          fullName: '',
          birthDate: '',
          gender: 'Nam',
          identityCard: '',
          address: '',
          phoneNumber: '',
          licensePlate: '',
          registrationDate: '',
        },
      ],
    };
  },
  mounted() {
    const storedServices = localStorage.getItem('services');
    if (!storedServices) {
      // Lưu danh sách dịch vụ mặc định vào localStorage nếu chưa có
      const defaultServices = [
        { name: 'Điện', price: 3000, quantity: 1, selected: false },
        { name: 'Nước', price: 20000, quantity: 1, selected: false },
        { name: 'Gửi xe máy', price: 80000, quantity: 1, selected: false },
        { name: 'Rác', price: 50000, quantity: 1, selected: false },
      ];
      localStorage.setItem('services', JSON.stringify(defaultServices));
    }
    this.customer.roomNumber = this.$route.query.roomNumber || "NAN";
    this.loadServices();
    this.customer.roomNumber = this.$route.query.roomNumber || "NAN";
  },
  methods: {
    loadServices() {
      const storedServices = localStorage.getItem('services');
      if (storedServices) {
        this.services = JSON.parse(storedServices);
      }
    },
    goBack() {
      this.$router.push('/landlord/room-index');
    },
    saveCustomer() {
      console.log(this.customer, this.contract, this.services, this.members);
      alert('Lưu thành công!');
    },
    addMember() {
      this.members.push({
        fullName: '',
        birthDate: '',
        gender: 'Nam',
        identityCard: '',
        address: '',
        phoneNumber: '',
        licensePlate: '',
        registrationDate: '',
      });
    },
    removeMember(index) {
      this.members.splice(index, 1);
    },
    saveServiceChanges() {
      localStorage.setItem('services', JSON.stringify(this.services));
    },
    formatCurrency(field) {
      const value = this.customer[field];
      this.customer[field] = value.replace(/\D/g, '');
    },
    updateValue(field) {
      const value = this.customer[field].replace(/\D/g, '');
      this.customer[field] = parseFloat(value) || 0;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.customer.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
.create-customer {
  margin-top: 30px;
  padding: 20px;
}

.form-label {
  font-weight: 600;
}

button {
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
}

.nav-tabs .nav-link {
  border-radius: 5px;
}

.tab-content {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.row {
  margin-bottom: 15px;
}

.input-group-text {
  background-color: #f0f0f0;
}

.img-thumbnail {
  max-width: 200px;
  margin-top: 10px;
}

.nav-tabs .nav-link.active {
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #fff;
}

.tab-content > .tab-pane {
  display: none;
}

.tab-content > .tab-pane.active {
  display: block;
}
</style>
