<template>
  <div class="create-service">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 v-if="isEditMode">Sửa dịch vụ</h2>
      <h2 v-else>Thêm dịch vụ</h2>
      <div>
        <button class="btn btn-warning me-2" @click="goBack">
          <i class="fa fa-undo"></i> Quay về
        </button>
        <button class="btn btn-success" @click="saveService">
          <i class="fa fa-check"></i> Lưu
        </button>
      </div>
    </div>

    <form>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="serviceName" class="form-label">Tên *</label>
          <input type="text" v-model="service.name" id="serviceName" class="form-control" :class="{'is-invalid': validationErrors.name}"/>
          <div class="invalid-feedback">Tên không được để trống</div>
        </div>

        <div class="col-md-6">
          <label for="serviceType" class="form-label">Loại *</label>
          <select v-model="service.type" id="serviceType" class="form-select" :class="{'is-invalid': validationErrors.type}">
            <option value="">Chọn loại dịch vụ</option>
            <option value="ĐIỆN">Điện</option>
            <option value="NƯỚC">Nước</option>
            <option value="KHÁC">Khác</option>
          </select>
          <div class="invalid-feedback">Loại dịch vụ không được để trống</div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label for="price" class="form-label">Đơn giá *</label>
          <div class="input-group">
            <input type="number" v-model="service.price" id="price" class="form-control" :class="{'is-invalid': validationErrors.price}" min="0"/>
            <span class="input-group-text">VNĐ</span>
          </div>
          <div class="invalid-feedback">Đơn giá không được để trống</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <div>
            <input type="checkbox" v-model="service.isActive" /> Đang dùng
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-12">
          <label for="note" class="form-label">Ghi chú</label>
          <textarea v-model="service.note" id="note" class="form-control"></textarea>
        </div>
      </div>

      <p class="text-danger">(*): Thông tin bắt buộc</p>
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
      validationErrors: {},
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
    goBack() {
      this.$router.push('/landlord/service-index');
    },
    saveService() {
      this.validationErrors = {};

      // Validate the required fields
      if (!this.service.name) {
        this.validationErrors.name = true;
      }
      if (!this.service.type) {
        this.validationErrors.type = true;
      }
      if (this.service.price <= 0) {
        this.validationErrors.price = true;
      }

      if (Object.keys(this.validationErrors).length === 0) {
        const services = JSON.parse(localStorage.getItem('services')) || [];

        if (this.isEditMode) {
          const index = services.findIndex(s => s.name === this.service.name);
          services[index] = this.service; // Cập nhật dịch vụ
        } else {
          services.push(this.service); // Thêm dịch vụ mới
        }

        localStorage.setItem('services', JSON.stringify(services));

        alert('Dịch vụ đã được lưu thành công!');
        this.goBack();
      }
    }
  }
};
</script>

<style scoped>
.create-service {
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
</style>
