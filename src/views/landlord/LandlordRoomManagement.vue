<template>
  <div class="landlord-room-management">
    <h1>Room Management</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Room Name</th>
        <th>Tenant Name</th> <!-- Tên người thuê chính -->
        <th>Occupants</th> <!-- Số lượng người ở -->
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="room in rooms" :key="room.id">
        <td>{{ room.id }}</td>
        <td>{{ room.name }}</td>
        <td>{{ room.tenant.name }}</td> <!-- Tên người ký hợp đồng -->
        <td>{{ room.occupants.length }} people</td> <!-- Số lượng người ở -->
        <td>{{ room.status }}</td>
        <td>
          <button @click="viewRoomDetails(room.id)">View Details</button>
          <button @click="editRoom(room.id)">Edit</button>
          <button @click="deleteRoom(room.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordRoomManagement',
  data() {
    return {
      rooms: [
        { id: 1, name: 'Room 101', tenant: { name: 'John Doe' }, occupants: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }], status: 'Occupied' },
        { id: 2, name: 'Room 102', tenant: { name: 'Michael Scott' }, occupants: [{ id: 3, name: 'Michael Scott' }], status: 'Available' }
      ]
    };
  },
  methods: {
    viewRoomDetails(id) {
      // Chuyển đến trang chi tiết của phòng
      this.$router.push({ name: 'RoomDetails', params: { roomId: id } });
    },
    editRoom(id) {
      // Logic chỉnh sửa phòng
      alert(`Edit room with ID: ${id}`);
    },
    deleteRoom(id) {
      // Logic xóa phòng
      this.rooms = this.rooms.filter(room => room.id !== id);
      alert(`Room with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.landlord-room-management {
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
