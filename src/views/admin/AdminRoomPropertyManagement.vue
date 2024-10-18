<template>
  <div class="admin-room-property-management container">
    <h1 class="my-4">Quản Lý Nhà, Phòng Trọ và Tài Sản</h1>

    <!-- Tabs cho các chức năng chính -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#houses" role="tab">Quản lý Nhà</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#rooms" role="tab">Quản lý Phòng</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#assets" role="tab">Quản lý Tài Sản</a>
      </li>
    </ul>

    <!-- Nội dung của các tab -->
    <div class="tab-content">
      <!-- Quản lý Nhà -->
      <div class="tab-pane fade show active" id="houses" role="tabpanel">
        <h2>Danh Sách Nhà</h2>
        <button class="btn btn-success mb-3" @click="showAddHouseModal = true">Thêm Nhà Mới</button>
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên Nhà</th>
            <th>Địa Chỉ</th>
            <th>Số Phòng</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="house in houses" :key="house.id">
            <td>{{ house.id }}</td>
            <td>{{ house.name }}</td>
            <td>{{ house.address }}</td>
            <td>{{ house.rooms.length }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="selectHouse(house)">Chọn Nhà</button>
              <button class="btn btn-danger btn-sm" @click="deleteHouse(house.id)">Xóa</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Quản lý Phòng -->
      <div class="tab-pane fade" id="rooms" role="tabpanel" v-if="selectedHouse">
        <h2>Danh Sách Phòng - {{ selectedHouse.name }}</h2>
        <button class="btn btn-success mb-3" @click="showAddRoomModal = true">Thêm Phòng Mới</button>

        <!-- Kiểm tra nếu có phòng trong nhà đã chọn -->
        <table class="table table-bordered table-striped" v-if="selectedHouse.rooms && selectedHouse.rooms.length > 0">
          <thead>
          <tr>
            <th>ID</th>
            <th>Tên Phòng</th>
            <th>Diện Tích (m²)</th>
            <th>Giá Thuê (VND)</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="room in selectedHouse.rooms" :key="room.id">
            <td>{{ room.id }}</td>
            <td>{{ room.name }}</td>
            <td>{{ room.area }} m²</td>
            <td>{{ formatCurrency(room.rent) }}</td>
            <td>{{ room.status }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="editRoom(room)">Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="deleteRoom(room.id)">Xóa</button>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else>Chưa có phòng nào trong nhà này.</p>
      </div>

      <!-- Thông báo khi chưa chọn nhà -->
      <p v-else>Vui lòng chọn một nhà để quản lý phòng.</p>


      <!-- Quản lý Tài Sản -->
      <div class="tab-pane fade" id="assets" role="tabpanel" v-if="selectedHouse">
        <h2>Quản lý Tài Sản trong Từng Căn Hộ</h2>
        <div class="mb-3">
          <label for="roomSelect" class="form-label">Chọn Phòng</label>
          <select v-model="selectedRoom" class="form-select" id="roomSelect" v-if="selectedHouse">
            <option v-for="room in selectedHouse.rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
          </select>
        </div>

        <button class="btn btn-success mb-3" @click="showAddAssetModal = true" v-if="selectedRoom">Thêm Tài Sản</button>

        <!-- Hiển thị tài sản chỉ khi phòng đã được chọn -->
        <table class="table table-bordered table-striped" v-if="selectedRoomAssets.length > 0">
          <thead>
          <tr>
            <th>Tài Sản</th>
            <th>Trạng Thái Bảo Trì</th>
            <th>Hành Động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="asset in selectedRoomAssets" :key="asset.id">
            <td>{{ asset.name }}</td>
            <td>{{ asset.maintenanceStatus }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="editAsset(asset)">Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="deleteAsset(asset.id)">Xóa</button>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else>Chưa có tài sản nào trong phòng này.</p>
      </div>

    </div>

    <!-- Modal thêm/sửa nhà -->
    <div v-if="showAddHouseModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Nhà Mới</h5>
            <button type="button" class="btn-close" @click="closeHouseModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addHouse">
              <div class="mb-3">
                <label for="houseName" class="form-label">Tên Nhà</label>
                <input type="text" v-model="houseForm.name" class="form-control" required/>
              </div>
              <div class="mb-3">
                <label for="houseAddress" class="form-label">Địa Chỉ</label>
                <input type="text" v-model="houseForm.address" class="form-control" required/>
              </div>
              <button type="submit" class="btn btn-success">Thêm</button>
              <button type="button" class="btn btn-secondary" @click="closeHouseModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa phòng -->
    <div v-if="showAddRoomModal || showEditRoomModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditRoomModal ? 'Chỉnh Sửa Phòng' : 'Thêm Phòng Mới' }}</h5>
            <button type="button" class="btn-close" @click="closeRoomModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditRoomModal ? updateRoom() : addRoom()">
              <div class="mb-3">
                <label for="name" class="form-label">Tên Phòng</label>
                <input type="text" v-model="roomForm.name" class="form-control" required/>
              </div>
              <div class="mb-3">
                <label for="area" class="form-label">Diện Tích (m²)</label>
                <input type="number" v-model="roomForm.area" class="form-control" required/>
              </div>
              <div class="mb-3">
                <label for="rent" class="form-label">Giá Thuê (VND)</label>
                <input type="number" v-model="roomForm.rent" class="form-control" required/>
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Trạng Thái</label>
                <select v-model="roomForm.status" class="form-select">
                  <option value="rented">Đang cho thuê</option>
                  <option value="expired">Đã hết hợp đồng</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">{{ showEditRoomModal ? 'Cập Nhật' : 'Thêm' }}</button>
              <button type="button" class="btn btn-secondary" @click="closeRoomModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa tài sản -->
    <div v-if="showAddAssetModal || showEditAssetModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditAssetModal ? 'Chỉnh Sửa Tài Sản' : 'Thêm Tài Sản Mới' }}</h5>
            <button type="button" class="btn-close" @click="closeAssetModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showEditAssetModal ? updateAsset() : addAsset()">
              <div class="mb-3">
                <label for="assetName" class="form-label">Tên Tài Sản</label>
                <input type="text" v-model="assetForm.name" class="form-control" required/>
              </div>
              <div class="mb-3">
                <label for="maintenanceStatus" class="form-label">Trạng Thái Bảo Trì</label>
                <select v-model="assetForm.maintenanceStatus" class="form-select">
                  <option value="maintained">Đã bảo trì</option>
                  <option value="not maintained">Chưa bảo trì</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">{{ showEditAssetModal ? 'Cập Nhật' : 'Thêm' }}</button>
              <button type="button" class="btn btn-secondary" @click="closeAssetModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminRoomPropertyManagement',
  data() {
    return {
      houses: [
        {
          id: 1,
          name: 'Nhà A',
          address: '123 Đường ABC',
          rooms: [{ id: 101, name: 'Phòng 101', area: 30, rent: 5000000, status: 'rented' }]
        },
        {
          id: 2,
          name: 'Nhà B',
          address: '456 Đường XYZ',
          rooms: [{ id: 102, name: 'Phòng 102', area: 25, rent: 4500000, status: 'expired' }]
        }
      ],
      assets: [
        { id: 1, roomId: 101, name: 'Máy lạnh', maintenanceStatus: 'maintained' },
        { id: 2, roomId: 102, name: 'Tủ lạnh', maintenanceStatus: 'not maintained' }
      ],
      selectedHouse: null,
      selectedRoom: null,
      houseForm: { id: null, name: '', address: '' },
      roomForm: { id: null, name: '', area: 0, rent: 0, status: 'rented' },
      assetForm: { id: null, name: '', maintenanceStatus: 'not maintained' },
      showAddHouseModal: false,
      showEditRoomModal: false,
      showAddRoomModal: false,
      showAddAssetModal: false,
      showEditAssetModal: false
    };
  },
  computed: {
    selectedRoomAssets() {
      return this.assets.filter(asset => asset.roomId === this.selectedRoom);
    }
  },
  methods: {
    // House Methods
    addHouse() {
      if (this.houseForm.name && this.houseForm.address) {
        const newHouse = { ...this.houseForm, id: Date.now(), rooms: [] };
        this.houses.push(newHouse);
        this.closeHouseModal();
      } else {
        alert("Please fill out all fields for the house.");
      }
    },
    closeHouseModal() {
      this.showAddHouseModal = false;
      this.resetHouseForm();
    },
    resetHouseForm() {
      this.houseForm = { id: null, name: '', address: '' };
    },
    selectHouse(house) {
      this.selectedHouse = house;
      this.selectedRoom = null;
    },
    deleteHouse(houseId) {
      if (confirm('Are you sure you want to delete this house?')) {
        this.houses = this.houses.filter(house => house.id !== houseId);
      }
    },

    // Room Methods
    addRoom() {
      if (this.roomForm.name && this.roomForm.area && this.roomForm.rent) {
        const newRoom = { ...this.roomForm, id: Date.now() };
        this.selectedHouse.rooms.push(newRoom);
        this.closeRoomModal();
      } else {
        alert("Please fill out all fields for the room.");
      }
    },
    closeRoomModal() {
      this.showAddRoomModal = false;
      this.showEditRoomModal = false;
      this.resetRoomForm();
    },
    resetRoomForm() {
      this.roomForm = { id: null, name: '', area: 0, rent: 0, status: 'rented' };
    },
    editRoom(room) {
      this.roomForm = { ...room };
      this.showEditRoomModal = true;
    },
    updateRoom() {
      const index = this.selectedHouse.rooms.findIndex(room => room.id === this.roomForm.id);
      if (index !== -1) {
        this.selectedHouse.rooms.splice(index, 1, this.roomForm);
      }
      this.closeRoomModal();
    },
    deleteRoom(roomId) {
      if (confirm('Are you sure you want to delete this room?')) {
        this.selectedHouse.rooms = this.selectedHouse.rooms.filter(room => room.id !== roomId);
      }
    },

    // Asset Methods
    addAsset() {
      if (this.assetForm.name && this.assetForm.maintenanceStatus) {
        const newAsset = { ...this.assetForm, id: Date.now(), roomId: this.selectedRoom };
        this.assets.push(newAsset);
        this.closeAssetModal();
      } else {
        alert("Please fill out all fields for the asset.");
      }
    },
    closeAssetModal() {
      this.showAddAssetModal = false;
      this.showEditAssetModal = false;
      this.resetAssetForm();
    },
    resetAssetForm() {
      this.assetForm = { id: null, name: '', maintenanceStatus: 'not maintained' };
    },
    editAsset(asset) {
      this.assetForm = { ...asset };
      this.showEditAssetModal = true;
    },
    updateAsset() {
      const index = this.assets.findIndex(asset => asset.id === this.assetForm.id);
      if (index !== -1) {
        this.assets.splice(index, 1, this.assetForm);
      }
      this.closeAssetModal();
    },
    deleteAsset(assetId) {
      if (confirm('Are you sure you want to delete this asset?')) {
        this.assets = this.assets.filter(asset => asset.id !== assetId);
      }
    },

    // Utility Methods
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
  }
};

</script>

<style scoped>
.admin-room-property-management {
  padding: 20px;
}

.table {
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
}
</style>
