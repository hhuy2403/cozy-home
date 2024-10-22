<template>
  <div class="create-service">
    <!-- Header with title and buttons -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0" v-if="isEditMode">Sửa Dịch Vụ</h3>
      <h3 class="mb-0" v-else>Thêm Dịch Vụ</h3>
      <div>
        <router-link to="/landlord/service-index">
          <button type="button" class="btn btn-warning me-2">
            <i class="fa fa-undo"></i> Quay về
          </button>
        </router-link>
        <button type="submit" class="btn btn-success" @click="validateAndSave">
          <i class="fa fa-check"></i> Lưu
        </button>
      </div>
    </div>

    <form @submit.prevent="validateAndSave">
      <!-- Service Name and Type -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="serviceName" class="form-label">Tên Dịch Vụ <span>&nbsp;*</span></label>
          <input type="text" v-model="service.name" id="serviceName" class="form-control form-control-sm"
                 :class="{'is-invalid': errors.name}" placeholder="Nhập tên dịch vụ" required />
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>

        <div class="col-md-6">
          <label for="serviceType" class="form-label">Loại Dịch Vụ <span>&nbsp;*</span></label>
          <select v-model="service.type" id="serviceType" class="form-select form-select-sm"
                  :class="{'is-invalid': errors.type}">
            <option value="">Chọn loại dịch vụ</option>
            <option value="ĐIỆN">Điện</option>
            <option value="NƯỚC">Nước</option>
            <option value="KHÁC">Khác</option>
          </select>
          <div class="invalid-feedback" v-if="errors.type">{{ errors.type }}</div>
        </div>
      </div>

      <!-- Service Price and Status -->
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="price" class="form-label">Đơn Giá <span>&nbsp;*</span></label>
          <div class="input-group">
            <input type="number" v-model="service.price" id="price" class="form-control form-control-sm"
                   :class="{'is-invalid': errors.price}" min="0" placeholder="Nhập đơn giá" required />
            <span class="input-group-text">VNĐ</span>
          </div>
          <div class="invalid-feedback" v-if="errors.price">{{ errors.price }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="service.isActive" id="isActive" />
            <label class="form-check-label" for="isActive">Đang dùng</label>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="row mb-3">
        <div class="col-md-12">
          <label for="note" class="form-label d-block">Ghi Chú</label> <br>
          <textarea v-model="service.note" id="note" class="form-control form-control-sm d-block" placeholder="Nhập ghi chú nếu có"></textarea>
        </div>
      </div>

      <!-- Required Information -->
      <div class="mb-4">
        <span class="text-danger">(*): Thông tin bắt buộc</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateService',
  data() {
    return {
      service: {
        name: '',
        type: '',
        price: 0,
        isActive: true,
        note: ''
      },
      errors: {},
      isEditMode: false
    };
  },
  mounted() {
    if (this.$route.query.edit) {
      const editingService = JSON.parse(localStorage.getItem('editingService'));
      if (editingService) {
        this.service = editingService;
        this.isEditMode = true;
      }
    }
  },
  methods: {
    validateAndSave() {
      this.errors = {};

      // Validation checks
      if (!this.service.name) this.errors.name = "Vui lòng nhập tên dịch vụ";
      if (!this.service.type) this.errors.type = "Vui lòng chọn loại dịch vụ";
      if (this.service.price <= 0) this.errors.price = "Vui lòng nhập đơn giá hợp lệ";

      if (Object.keys(this.errors).length === 0) {
        this.saveService();
      }
    },
    saveService() {
      let services = JSON.parse(localStorage.getItem('services')) || [];

      if (this.isEditMode) {
        const index = services.findIndex(s => s.name === this.service.name);
        services[index] = this.service; // Update service
      } else {
        services.push(this.service); // Add new service
      }

      localStorage.setItem('services', JSON.stringify(services));

      alert('Dịch vụ đã được lưu thành công!');
      this.$router.push('/landlord/service-index');
    }
  }
};
</script>

<style scoped>
.create-service {
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}
</style>
