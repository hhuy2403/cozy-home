<template>
  <div class="landlord-room-member-management">
    <h1>Manage Members for Room {{ roomName }}</h1>
    <button @click="addMember">Add New Member</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Tenant Name</th>
        <th>Join Date</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="member in members" :key="member.id">
        <td>{{ member.id }}</td>
        <td>{{ member.name }}</td>
        <td>{{ member.joinDate }}</td>
        <td>
          <button @click="removeMember(member.id)">Remove</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordRoomMemberManagement',
  props: ['roomId'], // Nhận roomId từ route params
  data() {
    return {
      roomName: 'Sample Room Name', // Thay bằng dữ liệu thực tế
      members: [
        { id: 1, name: 'John Doe', joinDate: '2023-08-01' },
        { id: 2, name: 'Jane Smith', joinDate: '2023-09-01' }
      ]
    };
  },
  methods: {
    addMember() {
      // Logic thêm người mới vào phòng
      alert('Add new member');
    },
    removeMember(id) {
      // Logic xóa người khỏi phòng
      this.members = this.members.filter(member => member.id !== id);
      alert(`Member with ID: ${id} removed`);
    }
  },
  created() {
    // Logic để lấy tên phòng và danh sách thành viên từ roomId
    this.roomName = 'Room 101'; // Ví dụ tạm thời
  }
}
</script>

<style scoped>
.landlord-room-member-management {
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
