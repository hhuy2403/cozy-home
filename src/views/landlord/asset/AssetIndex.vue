<template>
  <div class="container mt-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Danh sách tài sản</h2>
      <!-- Action Buttons -->
      <div>
        <button class="btn btn-warning"><i class="fas fa-search"></i> Xem</button>
        <button class="btn btn-success ml-2" @click="addAsset"><i class="fas fa-plus"></i> Thêm</button>
        <button class="btn btn-danger ml-2" @click="deleteSelectedAssets"><i class="fas fa-trash"></i> Xóa</button>
        <button class="btn btn-primary ml-2" @click="exportToExcel"><i class="fas fa-file-excel"></i> Xuất file excel</button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="house-select">Nhà</label>
        <select id="house-select" class="form-control" v-model="selectedHouse">
          <option value="all">Tất cả</option>
          <option v-for="house in houses" :key="house.id" :value="house.id">{{ house.name }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="room-select">Phòng</label>
        <select id="room-select" class="form-control" v-model="selectedRoom">
          <option value="all">Phòng</option>
          <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label for="entries-select">Xem</label>
        <select id="entries-select" class="form-control" v-model="itemsPerPage">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Assets Table -->
    <table class="table table-bordered table-hover">
      <thead class="thead-light">
      <tr>
        <th><input type="checkbox" v-model="selectAll" @change="toggleAll"></th>
        <th>Nhà</th>
        <th>Phòng</th>
        <th>Mã TS</th>
        <th>Tên TS</th>
        <th>Ngày sử dụng</th>
        <th>Số lượng</th>
        <th>Đơn giá (VND)</th>
        <th>Đã thanh lý</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(asset, index) in paginatedAssets" :key="index">
        <td><input type="checkbox" v-model="selectedAssets" :value="asset"></td>
        <td>{{ asset.house }}</td>
        <td>{{ asset.room }}</td>
        <td>{{ asset.assetCode }}</td>
        <td>{{ asset.assetName }}</td>
        <td>{{ asset.usageDate }}</td>
        <td>{{ asset.quantity }}</td>
        <td>{{ asset.price }}</td>
        <td>{{ asset.isDisposed ? 'Có' : 'Không' }}</td>
      </tr>
      <tr v-if="paginatedAssets.length === 0">
        <td colspan="9" class="text-center">Không tìm thấy dòng nào phù hợp</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex justify-content-between">
      <div>
        Đang xem {{ startItem }} đến {{ endItem }} trong tổng số {{ totalItems }} mục
      </div>
      <div>
        <button class="btn btn-light" :disabled="currentPage === 1" @click="previousPage">Trước</button>
        <button class="btn btn-light" :disabled="currentPage === totalPages" @click="nextPage">Tiếp</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
export default {
  data() {
    return {
      selectedHouse: 'all',
      selectedRoom: 'all',
      itemsPerPage: 20,
      currentPage: 1,
      selectAll: false,
      selectedAssets: [],
      houses: [], // Danh sách nhà từ localStorage
      rooms: [], // Danh sách phòng từ localStorage
      assets: [] // Danh sách tài sản từ localStorage
    };
  },
  computed: {
    filteredRooms() {
      if (this.selectedHouse === 'all') {
        return this.rooms;
      }
      return this.rooms.filter(room => room.houseId === this.selectedHouse);
    },
    filteredAssets() {
      let filtered = this.assets;
      if (this.selectedHouse !== 'all') {
        filtered = filtered.filter(asset => asset.house === this.houses.find(h => h.id === this.selectedHouse).name);
      }
      if (this.selectedRoom !== 'all') {
        filtered = filtered.filter(asset => asset.room === this.selectedRoom);
      }
      return filtered;
    },
    paginatedAssets() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAssets.slice(start, end);
    },
    totalItems() {
      return this.filteredAssets.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    }
  },
  mounted() {
    this.loadDataFromLocalStorage(); // Load dữ liệu từ localStorage khi component được mount
  },
  methods: {
    loadDataFromLocalStorage() {
      let storedHomes = localStorage.getItem('homes');
      if (storedHomes) {
        let homes = JSON.parse(storedHomes);

        // Lưu danh sách nhà và phòng
        this.houses = homes.map(home => ({
          id: home.id,
          name: home.name
        }));

        this.rooms = homes.flatMap(home =>
            home.rooms.map(room => ({
              roomNumber: room.roomNumber,
              houseId: home.id
            }))
        );

        // Gộp danh sách tài sản
        this.assets = homes.flatMap(home =>
            home.rooms.flatMap(room =>
                (room.assets || []).map(asset => ({
                  house: home.name, // Lấy tên nhà
                  room: room.roomNumber, // Lấy số phòng
                  assetCode: asset.assetCode || '',
                  assetName: asset.assetName || '',
                  usageDate: asset.usageDate || '',
                  quantity: asset.quantity || 0,
                  price: asset.price || '',
                  isDisposed: asset.isDisposed || false
                }))
            )
        );
      }
    },
    addAsset() {
      this.$router.push('/landlord/asset-create');
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    toggleAll() {
      if (this.selectAll) {
        this.selectedAssets = [...this.paginatedAssets];
      } else {
        this.selectedAssets = [];
      }
    },
    deleteSelectedAssets() {
      if (this.selectedAssets.length > 0) {
        // Xác nhận việc xóa tài sản
        if (confirm('Bạn có chắc chắn muốn xóa các tài sản đã chọn?')) {
          // Lấy dữ liệu homes từ localStorage
          let homes = JSON.parse(localStorage.getItem('homes'));

          // Lặp qua từng tài sản được chọn để xóa
          this.selectedAssets.forEach(selectedAsset => {
            homes.forEach(home => {
              home.rooms.forEach(room => {
                // Lọc lại danh sách tài sản, loại bỏ tài sản đã chọn
                room.assets = (room.assets || []).filter(asset => asset.assetCode !== selectedAsset.assetCode);
              });
            });
          });

          // Cập nhật lại assets sau khi xóa
          this.assets = this.assets.filter(asset => !this.selectedAssets.includes(asset));

          // Lưu lại homes vào localStorage
          localStorage.setItem('homes', JSON.stringify(homes));

          // Thông báo thành công
          alert('Đã xóa các tài sản đã chọn thành công!');

          // Xóa danh sách tài sản đã chọn và bỏ chọn tất cả
          this.selectedAssets = [];
          this.selectAll = false;
        }
      } else {
        alert('Vui lòng chọn ít nhất một tài sản để xóa.');
      }
    },
    exportToExcel() {
      // Tạo bảng tính với dữ liệu từ assets
      const worksheet = XLSX.utils.json_to_sheet(this.assets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');

      // Xuất file Excel
      XLSX.writeFile(workbook, 'Danh_sach_tai_san.xlsx');
    },
  }
};
</script>

<style scoped>
.container {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table {
  margin-top: 20px;
}

thead {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: space-between;
}

.btn {
  margin-right: 10px;
}

.btn-light {
  margin-left: 5px;
}
</style>
