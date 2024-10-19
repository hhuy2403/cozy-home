<template>
  <div class="landlord-room-asset-management">
    <h1>Asset Management for Room {{ roomName }}</h1>
    <button @click="addAsset">Add New Asset</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Asset Name</th>
        <th>Condition</th>
        <th>Quantity</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="asset in assets" :key="asset.id">
        <td>{{ asset.id }}</td>
        <td>{{ asset.name }}</td>
        <td>{{ asset.condition }}</td>
        <td>{{ asset.quantity }}</td>
        <td>
          <button @click="editAsset(asset.id)">Edit</button>
          <button @click="deleteAsset(asset.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordRoomAssetManagement',
  props: ['roomId'], // Nhận roomId từ router params hoặc prop
  data() {
    return {
      roomName: 'Sample room Name', // Thay bằng dữ liệu thực tế từ roomId
      assets: [
        { id: 1, name: 'Bed', condition: 'Good', quantity: 2 },
        { id: 2, name: 'Air Conditioner', condition: 'Average', quantity: 1 },
        { id: 3, name: 'Desk', condition: 'Good', quantity: 1 }
      ]
    };
  },
  methods: {
    addAsset() {
      // Logic thêm tài sản mới
      alert('Add new asset');
    },
    editAsset(id) {
      // Logic chỉnh sửa tài sản
      alert(`Edit asset with ID: ${id}`);
    },
    deleteAsset(id) {
      // Logic xóa tài sản
      this.assets = this.assets.filter(asset => asset.id !== id);
      alert(`Asset with ID: ${id} deleted`);
    }
  },
  created() {
    // Logic để lấy tên phòng từ roomId hoặc tải dữ liệu tài sản từ server
    this.roomName = 'room 101'; // Ví dụ tạm thời
  }
}
</script>

<style scoped>
.landlord-room-asset-management {
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
button {
  margin-right: 5px;
}
</style>
