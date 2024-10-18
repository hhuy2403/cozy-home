<template>
  <div class="admin-landlord-contract-management">
    <h1>Landlord Contract Management</h1>
    <button @click="addContract">Add New Contract</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Landlord Name</th>
        <th>Property</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="contract in contracts" :key="contract.id">
        <td>{{ contract.id }}</td>
        <td>{{ contract.landlordName }}</td>
        <td>{{ contract.property }}</td>
        <td>{{ contract.startDate }}</td>
        <td>{{ contract.endDate }}</td>
        <td>{{ contract.status }}</td>
        <td>
          <button @click="editContract(contract.id)">Edit</button>
          <button @click="deleteContract(contract.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminLandlordContractManagement',
  data() {
    return {
      contracts: [
        { id: 1, landlordName: 'John Landlord', property: 'Apartment A', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
        { id: 2, landlordName: 'Jane Landlord', property: 'Villa B', startDate: '2022-01-01', endDate: '2022-12-31', status: 'Completed' }
      ]
    };
  },
  methods: {
    addContract() {
      // Logic thêm hợp đồng mới
      alert('Add new contract');
    },
    editContract(id) {
      // Logic chỉnh sửa hợp đồng
      alert(`Edit contract with ID: ${id}`);
    },
    deleteContract(id) {
      // Logic xóa hợp đồng
      this.contracts = this.contracts.filter(contract => contract.id !== id);
      alert(`Contract with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.admin-landlord-contract-management {
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
