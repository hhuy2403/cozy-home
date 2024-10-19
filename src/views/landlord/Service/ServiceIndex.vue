<template>
  <div class="service-index">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Danh sách dịch vụ</h2>
      <div>
        <button class="btn btn-success me-2" @click="goToCreateService">
          <i class="fa fa-plus"></i> Thêm dịch vụ
        </button>
        <button class="btn btn-danger" @click="deleteSelectedServices">
          <i class="fa fa-trash"></i> Xóa
        </button>
      </div>
    </div>

    <div class="alert alert-info">
      <strong>Lưu ý:</strong> Các dịch vụ phải được gán cho từng khách thuê phòng để khi tính tiền sẽ có tiền dịch vụ đó.
    </div>

    <table class="table table-bordered">
      <thead>
      <tr>
        <th><input type="checkbox" @change="toggleSelectAll" /></th>
        <th>Tên</th>
        <th>Loại dịch vụ</th>
        <th>Đơn giá (VNĐ)</th>
        <th>Đang dùng</th>
        <th>Hành động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(service, index) in services" :key="index">
        <td><input type="checkbox" v-model="service.selected" /></td>
        <td>{{ service.name }}</td>
        <td>{{ service.type }}</td>
        <td>{{ service.price.toLocaleString('vi-VN') }}</td>
        <td><input type="checkbox" v-model="service.isActive" disabled /></td>
        <td>
          <button class="btn btn-sm btn-primary me-2" @click="editService(index)">
            <i class="fa fa-edit"></i> Sửa
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteService(index)">
            <i class="fa fa-trash"></i> Xóa
          </button>
        </td>
      </tr>
      <tr v-if="services.length === 0">
        <td colspan="6" class="text-center">Không có dịch vụ nào được tạo</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ServiceIndex',
  data() {
    return {
      services: JSON.parse(localStorage.getItem('services')) || []
    };
  },
  methods: {
    goToCreateService() {
      this.$router.push('/landlord/service-create');
    },
    editService(index) {
      const service = this.services[index];
      // Lưu dịch vụ được chọn vào localStorage để chuyển qua trang sửa
      localStorage.setItem('editingService', JSON.stringify(service));
      // Điều hướng đến trang sửa
      this.$router.push({ path: '/landlord/create-service', query: { edit: true } });
    },
    deleteService(index) {
      if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
        this.services.splice(index, 1);
        localStorage.setItem('services', JSON.stringify(this.services));
      }
    },
    deleteSelectedServices() {
      if (confirm('Bạn có chắc chắn muốn xóa các dịch vụ đã chọn?')) {
        this.services = this.services.filter(service => !service.selected);
        localStorage.setItem('services', JSON.stringify(this.services));
      }
    },
    toggleSelectAll(event) {
      const isChecked = event.target.checked;
      this.services.forEach(service => {
        service.selected = isChecked;
      });
    }
  }
};
</script>

<style scoped>
.service-index {
  margin-top: 30px;
  padding: 20px;
}

button {
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
