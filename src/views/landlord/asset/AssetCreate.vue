<template>
  <div class="container mt-4">
    <!-- Header Section with Title and Buttons -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Thêm tài sản</h2>
      <div>
        <button type="button" class="btn btn-warning mr-2" @click="goBack"><i class="fas fa-arrow-left"></i> Quay về</button>
        <button type="submit" form="assetForm" class="btn btn-success"><i class="fas fa-save"></i> Lưu</button>
      </div>
    </div>

    <!-- Form Section -->
    <form id="assetForm" @submit.prevent="saveAsset">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="assetCode">Mã tài sản</label>
            <input type="text" class="form-control" id="assetCode" v-model="asset.assetCode">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="assetName">Tên tài sản <span>*</span></label>
            <input type="text" class="form-control" id="assetName" v-model="asset.assetName" required>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="house">Nhà</label>
            <select id="house" class="form-control" v-model="asset.house" @change="loadRooms">
              <option value="all">Tất cả</option>
              <option v-for="house in houses" :key="house.id" :value="house.id">{{ house.name }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="room">Phòng</label>
            <select id="room" class="form-control" v-model="asset.room">
              <option value="all">Phòng</option>
              <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="price">Đơn giá</label>
            <div class="input-group">
              <input type="number" class="form-control" id="price" v-model="asset.price">
              <div class="input-group-append">
                <span class="input-group-text">VND</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="quantity">Số lượng <span>*</span></label>
            <input type="number" class="form-control" id="quantity" v-model="asset.quantity" required min="1">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="purchaseDate">Ngày mua</label>
            <input type="date" class="form-control" id="purchaseDate" v-model="asset.purchaseDate">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="usageDate">Ngày sử dụng</label>
            <input type="date" class="form-control" id="usageDate" v-model="asset.usageDate">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="disposalDate">Ngày thanh lý</label>
            <input type="date" class="form-control" id="disposalDate" v-model="asset.disposalDate">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="disposed" v-model="asset.isDisposed">
            <label class="form-check-label" for="disposed">Đã thanh lý</label>
          </div>
        </div>
        <div class="col-md-6 offset-md-3">
          <div class="form-group">
            <label for="notes">Ghi chú</label>
            <textarea class="form-control" id="notes" v-model="asset.notes"></textarea>
          </div>
        </div>
      </div>

      <!-- Note -->
      <div class="mt-3">
        <span class="text-danger">(*)</span> Thông tin bắt buộc
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: {
        assetCode: '',
        assetName: '',
        house: '',
        room: '',
        price: '',
        quantity: 1,
        purchaseDate: '',
        usageDate: '',
        disposalDate: '',
        isDisposed: false,
        notes: ''
      },
      houses: [], // Danh sách nhà
      filteredRooms: [] // Danh sách phòng sau khi chọn nhà
    };
  },
  mounted() {
    this.loadAssetData(); // Gọi phương thức để lấy dữ liệu từ localStorage khi component được mount
  },
  methods: {
    loadAssetData() {
      // Lấy danh sách homes từ localStorage
      let storedHomes = localStorage.getItem('homes');
      let homes = storedHomes ? JSON.parse(storedHomes) : [];

      // Gán danh sách homes vào biến houses
      this.houses = homes;

      // Mặc định chọn ngôi nhà và phòng đầu tiên nếu có dữ liệu
      if (homes.length > 0) {
        this.asset.house = homes[0].id;
        if (homes[0].rooms.length > 0) {
          this.asset.room = homes[0].rooms[0].roomNumber;
        }
      }

      // Cập nhật danh sách phòng khi chọn nhà mặc định
      this.loadRooms();
    },

    loadRooms() {
      // Tìm ngôi nhà đã chọn
      let selectedHome = this.houses.find(home => home.id === this.asset.house);

      // Cập nhật danh sách phòng
      if (selectedHome && selectedHome.rooms) {
        this.filteredRooms = selectedHome.rooms;
        if (this.filteredRooms.length > 0) {
          this.asset.room = this.filteredRooms[0].roomNumber; // Chọn phòng đầu tiên
        }
      } else {
        this.filteredRooms = [];
        this.asset.room = '';
      }
    },

    saveAsset() {
      // Lấy danh sách homes từ localStorage
      let storedHomes = localStorage.getItem('homes');
      let homes = storedHomes ? JSON.parse(storedHomes) : [];

      // Tìm ngôi nhà đã chọn
      let selectedHome = homes.find(home => home.id === this.asset.house);

      if (selectedHome) {
        // Tìm phòng đã chọn
        let selectedRoom = selectedHome.rooms.find(room => room.roomNumber === this.asset.room);

        if (selectedRoom) {
          // Thêm tài sản vào phòng
          if (!selectedRoom.assets) {
            selectedRoom.assets = [];
          }
          selectedRoom.assets.push({
            assetCode: this.asset.assetCode,
            assetName: this.asset.assetName,
            price: this.asset.price,
            quantity: this.asset.quantity,
            purchaseDate: this.asset.purchaseDate,
            usageDate: this.asset.usageDate,
            disposalDate: this.asset.disposalDate,
            isDisposed: this.asset.isDisposed,
            notes: this.asset.notes
          });

          // Lưu lại homes vào localStorage
          localStorage.setItem('homes', JSON.stringify(homes));

          // Thông báo thành công
          alert('Đã lưu tài sản thành công!');

          // Quay về trang trước
          this.goBack();
        } else {
          alert('Không tìm thấy phòng đã chọn!');
        }
      } else {
        alert('Không tìm thấy ngôi nhà đã chọn!');
      }
    },

    goBack() {
      this.$router.go(-1); // Điều hướng quay về trang trước
    }
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

.form-group {
  margin-bottom: 1rem;
}

.input-group-text {
  background-color: #e9ecef;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

textarea {
  min-height: 100px;
}
</style>
