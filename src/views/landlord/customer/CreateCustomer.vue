<template>
  <div class="create-customer">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 v-if="isViewOnly">Xem thông tin khách thuê phòng</h2>
      <h2 v-else-if="isEditMode">Sửa thông tin khách thuê phòng</h2>
      <h2 v-else>Thêm khách thuê phòng</h2>
      <div>
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>
        <button v-if="!isViewOnly" class="btn btn-success" @click="saveCustomer">
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
              <input
                  type="text"
                  v-model="customer.fullName"
                  id="fullName"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.fullName" class="text-danger">
                Vui lòng nhập họ và tên
              </div>
            </div>
            <div class="col-md-6">
              <label for="identityCard" class="form-label">CMND/CCCD *</label>
              <input
                  type="text"
                  v-model="customer.identityCard"
                  id="identityCard"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.identityCard" class="text-danger">
                Vui lòng nhập CMND/CCCD
              </div>
            </div>
          </div>

          <!-- Gender and Phone Numbers -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Giới tính *</label>
              <div>
                <input
                    type="radio"
                    v-model="customer.gender"
                    id="male"
                    value="Nam"
                    :readonly="isViewOnly"
                />
                <label for="male" class="me-3">Nam</label>
                <input
                    type="radio"
                    v-model="customer.gender"
                    id="female"
                    value="Nữ"
                    :readonly="isViewOnly"
                />
                <label for="female">Nữ</label>
              </div>
            </div>
            <div class="col-md-6">
              <label for="phoneNumber1" class="form-label">Điện thoại 1 *</label>
              <input
                  type="text"
                  v-model="customer.phoneNumber1"
                  id="phoneNumber1"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.phoneNumber1" class="text-danger">
                Vui lòng nhập số điện thoại 1
              </div>
            </div>
          </div>

          <!-- Additional Fields -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="phoneNumber2" class="form-label">Điện thoại 2</label>
              <input
                  type="text"
                  v-model="customer.phoneNumber2"
                  id="phoneNumber2"
                  class="form-control"
                  :readonly="isViewOnly"
              />
            </div>
            <div class="col-md-6">
              <label for="address" class="form-label">Địa chỉ thường trú</label>
              <input
                  type="text"
                  v-model="customer.address"
                  id="address"
                  class="form-control"
                  :readonly="isViewOnly"
              />
            </div>
          </div>

          <!-- Date of Birth and Email -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="birthDate" class="form-label">Ngày sinh (dd/MM/yyyy)</label>
              <input
                  type="date"
                  v-model="customer.birthDate"
                  id="birthDate"
                  class="form-control"
                  :readonly="isViewOnly"
              />
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input
                  type="email"
                  v-model="customer.email"
                  id="email"
                  class="form-control"
                  :readonly="isViewOnly"
              />
            </div>
          </div>

          <!-- Renting Room and Start Date -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="roomNumber" class="form-label">Thuê phòng số *</label>
              <input
                  type="text"
                  v-model="customer.roomNumber"
                  id="roomNumber"
                  class="form-control"
                  readonly
              />
            </div>
            <div class="col-md-6">
              <label for="startDate" class="form-label">Ngày bắt đầu *</label>
              <input
                  type="date"
                  v-model="customer.startDate"
                  id="startDate"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.startDate" class="text-danger">
                Vui lòng nhập ngày bắt đầu
              </div>
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
                    readonly
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
                    :readonly="isViewOnly"
                />
                <span class="input-group-text">VNĐ</span>
              </div>
              <div v-if="validationErrors.deposit" class="text-danger">
                Vui lòng nhập tiền đặt cọc
              </div>
            </div>
          </div>

          <!-- Payment Cycle and Payment Frequency -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="paymentCycle" class="form-label">Kỳ thanh toán *</label>
              <select
                  v-model="customer.paymentCycle"
                  id="paymentCycle"
                  class="form-select"
              >
                <option value="Kỳ 30">Kỳ 30</option>
                <option value="Kỳ 15">Kỳ 15</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="paymentFrequency" class="form-label">Thanh toán mỗi lần *</label>
              <div class="input-group">
                <input
                    type="number"
                    v-model="customer.paymentFrequency"
                    id="paymentFrequency"
                    class="form-control"
                    :readonly="isViewOnly"
                />
                <span class="input-group-text">Tháng</span>
              </div>
            </div>
          </div>

          <!-- Notes and Image Upload -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="notes" class="form-label">Ghi chú khác</label>
              <textarea
                  v-model="customer.notes"
                  id="notes"
                  class="form-control"
                  :readonly="isViewOnly"
              ></textarea>
            </div>
            <div class="col-md-6">
              <label for="image" class="form-label">Hình ảnh</label>
              <input
                  type="file"
                  @change="onFileChange"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <img
                  v-if="customer.image"
                  :src="customer.image"
                  class="img-thumbnail mt-2"
                  alt="Hình ảnh khách hàng"
              />
            </div>
          </div>

          <!-- Required Information -->
          <div class="mb-4">
            <span class="text-danger">(*): Thông tin bắt buộc</span>
          </div>
        </div>

        <!-- Service Tab -->
        <div
            class="tab-pane fade"
            :class="{ active: activeTab === 'service', show: activeTab === 'service' }"
            id="service"
            role="tabpanel"
        >
          <div class="alert alert-info">
            <strong>Lưu ý:</strong> Vui lòng chọn dịch vụ cho khách thuê.
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
              <td>
                <input type="checkbox" v-model="service.selected" />
              </td>
              <td>{{ service.name }}</td>
              <td>
                <div class="input-group">
                  <input
                      type="text"
                      v-model="service.price"
                      class="form-control"
                      :readonly="isViewOnly"
                  />
                  <span class="input-group-text">VNĐ</span>
                </div>
              </td>
              <td>
                <input
                    type="number"
                    v-model="service.quantity"
                    class="form-control"
                    min="1"
                    :readonly="isViewOnly"
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>


        <!-- Member Tab -->
        <div
            class="tab-pane fade"
            :class="{ active: activeTab === 'member', show: activeTab === 'member' }"
            id="member"
            role="tabpanel"
        >
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
              <td>
                <input
                    type="text"
                    v-model="member.fullName"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <input
                    type="date"
                    v-model="member.birthDate"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <div>
                  <input
                      type="radio"
                      v-model="member.gender"
                      :value="'Nam'"
                      :readonly="isViewOnly"
                  />
                  Nam
                  <input
                      type="radio"
                      v-model="member.gender"
                      :value="'Nữ'"
                      :readonly="isViewOnly"
                  />
                  Nữ
                </div>
              </td>
              <td>
                <input
                    type="text"
                    v-model="member.identityCard"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <input
                    type="text"
                    v-model="member.address"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <input
                    type="text"
                    v-model="member.phoneNumber"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <input
                    type="text"
                    v-model="member.licensePlate"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <input
                    type="date"
                    v-model="member.registrationDate"
                    class="form-control"
                    :readonly="isViewOnly"
                />
              </td>
              <td>
                <button class="btn btn-danger" @click="removeMember(index)">
                  Xóa
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          <button class="btn btn-success" @click.prevent="addMember">
            Thêm thành viên
          </button>
        </div>

        <!-- Contract Tab -->
        <div
            class="tab-pane fade"
            :class="{ active: activeTab === 'contract', show: activeTab === 'contract' }"
            id="contract"
            role="tabpanel"
        >
          <div class="alert alert-info">
            Các thông tin nhập ở đây sẽ được sử dụng cho việc xuất/in hợp đồng thuê phòng.
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="contractNumber" class="form-label">Số hợp đồng *</label>
              <input
                  type="text"
                  v-model="contract.contractNumber"
                  id="contractNumber"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.contractNumber" class="text-danger">
                Vui lòng nhập số hợp đồng
              </div>
            </div>
            <div class="col-md-6">
              <label for="contractDate" class="form-label">Ngày hợp đồng *</label>
              <input
                  type="date"
                  v-model="contract.contractDate"
                  id="contractDate"
                  class="form-control"
                  :readonly="isViewOnly"
              />
              <div v-if="validationErrors.contractDate" class="text-danger">
                Vui lòng nhập ngày hợp đồng
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="contractDuration" class="form-label">Thời gian HĐ</label>
              <div class="input-group">
                <input
                    type="number"
                    v-model="contract.contractDuration"
                    id="contractDuration"
                    class="form-control"
                    min="0"
                    :readonly="isViewOnly"
                />
                <span class="input-group-text">Tháng</span>
              </div>
            </div>
            <div class="col-md-6">
              <label for="contractEndDate" class="form-label">Ngày kết thúc HĐ</label>
              <input
                  type="date"
                  v-model="contract.contractEndDate"
                  id="contractEndDate"
                  class="form-control"
                  :readonly="isViewOnly"
              />
            </div>
          </div>

          <!-- Required Information -->
          <div class="mb-4">
            <span class="text-danger">(*): Thông tin bắt buộc</span>
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
      isViewOnly: false,
      isEditMode: false,
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
      houseName: '',
      contract: {
        contractNumber: '',
        contractDate: '',
        contractDuration: 0,
        contractEndDate: '',
      },
      services: [],
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
      validationErrors: {},
    };
  },
  mounted() {
    const roomNumber = this.$route.query.roomNumber || '101';
    const houseName = this.$route.query.houseName || 'HomeA';
    this.customer.roomNumber = roomNumber;

    const storedHomes = JSON.parse(localStorage.getItem('homes'));
    const currentHome = storedHomes.find((home) => home.name === houseName);

    if (currentHome) {
      const currentRoom = currentHome.rooms.find(
          (room) => room.roomNumber === roomNumber
      );

      if (currentRoom && currentRoom.customer) {
        this.customer = { ...currentRoom.customer };
        this.services = currentRoom.services ? [...currentRoom.services] : [];
        this.members = [...currentRoom.members];
        this.contract = currentRoom.contract ? { ...currentRoom.contract } : {};
      }

      this.isViewOnly = this.$route.query.viewOnly === 'true';
      this.isEditMode = this.$route.query.editMode === 'true';

      if (this.isViewOnly) {
        document.title = 'Xem thông tin khách thuê phòng';
      } else if (this.isEditMode) {
        document.title = 'Sửa thông tin khách thuê phòng';
      }

      this.loadServicesFromLocalStorage(houseName, roomNumber);
      this.loadDefaultServices(houseName);
      this.loadRoomData(houseName, roomNumber);
    } else {
      alert('Không tìm thấy nhà!');
    }
  },
  methods: {
    loadDefaultServices() {
      // Lấy danh sách dịch vụ từ localStorage
      const storedServices = JSON.parse(localStorage.getItem('services'));
      if (storedServices && storedServices.length > 0) {
        this.services = storedServices.map(service => ({
          ...service,
          selected: false, // Mặc định chưa chọn
          quantity: 1 // Mặc định số lượng là 1
        }));
      }
    },
    loadServicesFromLocalStorage(houseName, roomNumber) {
      const storedHomes = JSON.parse(localStorage.getItem('homes'));
      const currentHome = storedHomes.find((home) => home.name === houseName);

      if (currentHome) {
        const currentRoom = currentHome.rooms.find(
            (room) => room.roomNumber === roomNumber
        );

        if (currentRoom) {
          this.services = currentRoom.services ? [...currentRoom.services] : [];
        }
      }
    },
    loadRoomData(houseName, roomNumber) {
      const storedHomes = JSON.parse(localStorage.getItem('homes')) || [];
      const currentHome = storedHomes.find((home) => home.name === houseName);

      if (currentHome) {
        const currentRoom = currentHome.rooms.find(
            (room) => room.roomNumber === roomNumber
        );

        if (currentRoom) {
          // Kiểm tra nếu phòng đang trống
          if (!currentRoom.customer) {
            // Phòng trống, hiển thị giá thuê từ thông tin phòng
            this.customer.rentalCost = currentRoom.price;
            this.loadDefaultServices(); // Tải dịch vụ mặc định nếu phòng trống
          } else {
            // Phòng đã có khách thuê, tải thông tin khách thuê và giá thuê
            this.customer = { ...currentRoom.customer };
            this.customer.rentalCost = currentRoom.price; // Hiển thị giá thuê từ phòng
            this.services = [...currentRoom.services]; // Tải dịch vụ đã chọn
          }
        }
      }
    },
    goBack() {
      this.$router.push('/landlord/room-index');
    },
    saveCustomer() {
      if (!this.validateCustomer()) return;

      const houseName = this.$route.query.houseName || 'HomeA';
      const roomNumber = this.customer.roomNumber;

      const storedHomes = JSON.parse(localStorage.getItem('homes'));
      const currentHome = storedHomes.find((home) => home.name === houseName);

      if (currentHome) {
        const currentRoom = currentHome.rooms.find(
            (room) => room.roomNumber === roomNumber
        );

        if (currentRoom) {
          currentRoom.customer = { ...this.customer };
          currentRoom.services = this.services.map(service => ({
            ...service,
            selected: service.selected
          }));
          currentRoom.members = [...this.members];
          currentRoom.contract = { ...this.contract };
          currentRoom.isRented = true;
        }

        localStorage.setItem('homes', JSON.stringify(storedHomes));

        alert('Lưu thông tin khách thuê thành công!');
        this.$router.push('/landlord/room-index');
      } else {
        alert('Không tìm thấy nhà hoặc phòng!');
      }
    },
    validateCustomer() {
      this.validationErrors = {};

      if (!this.customer.fullName) this.validationErrors.fullName = true;
      if (!this.customer.identityCard) this.validationErrors.identityCard = true;
      if (!this.customer.phoneNumber1) this.validationErrors.phoneNumber1 = true;
      if (!this.customer.startDate) this.validationErrors.startDate = true;
      if (!this.customer.rentalCost) this.validationErrors.rentalCost = true;
      if (!this.customer.deposit) this.validationErrors.deposit = true;
      if (!this.contract.contractNumber)
        this.validationErrors.contractNumber = true;
      if (!this.contract.contractDate) this.validationErrors.contractDate = true;

      return Object.keys(this.validationErrors).length === 0;
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
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
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

.nav-tabs .nav-link:hover {
  color: #1e2d3b;
  background-color: #fff;
}

.table th {
  background-color: #2a3f54;
  color: #fff;
}
</style>
