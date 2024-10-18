<template>
  <div class="landlord-deposit-management">
    <h1>Deposit Management</h1>
    <button @click="addDeposit">Add New Deposit</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Room Name</th>
        <th>Tenant Name</th>
        <th>Deposit Amount</th>
        <th>Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="deposit in deposits" :key="deposit.id">
        <td>{{ deposit.id }}</td>
        <td>{{ deposit.roomName }}</td>
        <td>{{ deposit.tenantName }}</td>
        <td>{{ deposit.amount }}</td>
        <td>{{ deposit.date }}</td>
        <td>{{ deposit.status }}</td>
        <td>
          <button @click="editDeposit(deposit.id)">Edit</button>
          <button @click="deleteDeposit(deposit.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordDepositManagement',
  data() {
    return {
      deposits: [
        { id: 1, roomName: 'Room A', tenantName: 'John Doe', amount: '500 USD', date: '2023-09-01', status: 'Pending' },
        { id: 2, roomName: 'Room B', tenantName: 'Jane Smith', amount: '300 USD', date: '2023-09-02', status: 'Confirmed' }
      ]
    };
  },
  methods: {
    addDeposit() {
      // Logic thêm thông tin đặt cọc mới
      alert('Add new deposit');
    },
    editDeposit(id) {
      // Logic chỉnh sửa thông tin đặt cọc
      alert(`Edit deposit with ID: ${id}`);
    },
    deleteDeposit(id) {
      // Logic xóa thông tin đặt cọc
      this.deposits = this.deposits.filter(deposit => deposit.id !== id);
      alert(`Deposit with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.landlord-deposit-management {
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
