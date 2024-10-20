<template>
  <div class="service-index">
    <!-- Header Section -->
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

    <!-- Info Alert -->
    <div class="alert alert-info">
      <strong>Lưu ý:</strong> Các dịch vụ phải được gán cho từng khách thuê phòng để khi tính tiền sẽ có tiền dịch vụ đó.
    </div>

    <!-- Service Table -->
    <table class="table table-hover table-bordered table-responsive-md">
      <thead class="table-light">
      <tr>
        <th scope="col">
          <input type="checkbox" @change="toggleSelectAll" />
        </th>
        <th scope="col">Tên</th>
        <th scope="col">Loại dịch vụ</th>
        <th scope="col">Đơn giá (VNĐ)</th>
        <th scope="col">Đang dùng</th>
        <th scope="col">Hành động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(service, index) in services" :key="index">
        <td>
          <input type="checkbox" v-model="service.selected" />
        </td>
        <td>{{ service.name }}</td>
        <td>{{ service.type }}</td>
        <td>{{ formatCurrency(service.price) }}</td>
        <td>
          <input type="checkbox" v-model="service.isActive" disabled />
        </td>
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
      services: JSON.parse(localStorage.getItem('services')) || [],
    };
  },
  methods: {
    goToCreateService() {
      this.$router.push('/landlord/create-service');
    },
    editService(index) {
      const service = this.services[index];
      localStorage.setItem('editingService', JSON.stringify(service));
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
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
  },
};
</script>

<style scoped>
.service-index {
  margin-top: 50px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

table th,
table td {
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table th {
  background-color: #2a3f54;
  color: #fff;
}
</style>
