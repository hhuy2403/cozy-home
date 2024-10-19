<template>
  <div class="contract-management container">
    <h1 class="my-4">Quản Lý Hợp Đồng</h1>

    <!-- Nút thêm hợp đồng mới -->
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <button @click="showAddContractModal = true" class="btn btn-success">Thêm Hợp Đồng Mới</button>
    </div>

    <!-- Danh sách hợp đồng -->
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="table-dark">
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('name')">Tên Hợp Đồng</th>
          <th @click="sortBy('party')">Người Thuê/Chủ Nhà</th>
          <th @click="sortBy('startDate')">Ngày Bắt Đầu</th>
          <th @click="sortBy('endDate')">Ngày Kết Thúc</th>
          <th @click="sortBy('status')">Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="contract in contracts" :key="contract.id">
          <td>{{ contract.id }}</td>
          <td>{{ contract.name }}</td>
          <td>{{ contract.party }}</td>
          <td>{{ contract.startDate }}</td>
          <td>{{ contract.endDate }}</td>
          <td>{{ contract.status }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="extendContract(contract)">Gia Hạn</button>
            <button class="btn btn-danger btn-sm" @click="deleteContract(contract.id)">Xóa</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm hợp đồng -->
    <div v-if="showAddContractModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Hợp Đồng Mới</h5>
            <button type="button" class="btn-close" @click="closeAddContractModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addContract">
              <div class="mb-3">
                <label for="contractName" class="form-label">Tên Hợp Đồng</label>
                <input type="text" v-model="newContract.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="party" class="form-label">Người Thuê/Chủ Nhà</label>
                <input type="text" v-model="newContract.party" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="startDate" class="form-label">Ngày Bắt Đầu</label>
                <input type="date" v-model="newContract.startDate" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="endDate" class="form-label">Ngày Kết Thúc</label>
                <input type="date" v-model="newContract.endDate" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-success">Thêm Hợp Đồng</button>
              <button type="button" class="btn btn-secondary" @click="closeAddContractModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Theo dõi hợp đồng sắp hết hạn -->
    <div class="alert alert-warning mt-4" v-if="upcomingContracts.length">
      <h5 class="alert-heading">Hợp Đồng Sắp Hết Hạn</h5>
      <ul>
        <li v-for="contract in upcomingContracts" :key="contract.id">
          {{ contract.name }} - Hết hạn vào {{ contract.endDate }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import "@/styles/admin/contract-management.css"

export default {
  name: 'ContractManagement',
  data() {
    return {
      contracts: [
        { id: 1, name: 'Hợp Đồng A', party: 'Người Thuê A', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Đang hiệu lực' },
        { id: 2, name: 'Hợp Đồng B', party: 'Chủ Nhà B', startDate: '2024-06-01', endDate: '2024-12-31', status: 'Đang hiệu lực' }
      ],
      showAddContractModal: false,
      newContract: { name: '', party: '', startDate: '', endDate: '' },
      sortKey: '',
      sortAsc: true,
    };
  },
  computed: {
    upcomingContracts() {
      const today = new Date();
      return this.contracts.filter(contract => {
        const endDate = new Date(contract.endDate);
        return endDate > today && endDate <= new Date(today.setDate(today.getDate() + 30));
      });
    }
  },
  methods: {
    addContract() {
      const newId = this.contracts.length ? this.contracts[this.contracts.length - 1].id + 1 : 1;
      this.contracts.push({ ...this.newContract, id: newId, status: 'Đang hiệu lực' });
      this.closeAddContractModal();
      Swal.fire('Thành công', 'Hợp đồng mới đã được thêm thành công!', 'success');
    },
    deleteContract(id) {
      Swal.fire({
        title: 'Bạn có chắc muốn xóa hợp đồng này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          this.contracts = this.contracts.filter(contract => contract.id !== id);
          Swal.fire('Đã Xóa', 'Hợp đồng đã bị xóa.', 'success');
        }
      });
    },
    extendContract(contract) {
      const newEndDate = new Date(contract.endDate);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      contract.endDate = newEndDate.toISOString().split('T')[0];
      Swal.fire('Gia Hạn Thành Công', `Hợp đồng "${contract.name}" đã được gia hạn đến ${contract.endDate}.`, 'success');
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
      this.contracts.sort((a, b) => {
        if (a[key] < b[key]) return this.sortAsc ? -1 : 1;
        if (a[key] > b[key]) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },
    closeAddContractModal() {
      this.showAddContractModal = false;
      this.newContract = { name: '', party: '', startDate: '', endDate: ''};
    },
  },
};
</script>
