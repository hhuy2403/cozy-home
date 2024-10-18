<template>
  <div class="landlord-contracts">
    <h1>Contracts Management</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Tenant</th>
        <th>Property</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="contract in contracts" :key="contract.id">
        <td>{{ contract.id }}</td>
        <td>{{ contract.tenant }}</td>
        <td>{{ contract.property }}</td>
        <td>{{ contract.startDate }}</td>
        <td>{{ contract.endDate }}</td>
        <td>{{ contract.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordContracts',
  data() {
    return {
      contracts: [
        { id: 1, tenant: 'John Doe', property: 'Apartment A', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
        { id: 2, tenant: 'Jane Smith', property: 'Villa B', startDate: '2022-01-01', endDate: '2022-12-31', status: 'Completed' }
      ]
    };
  }
}
</script>

<style scoped>
.landlord-contracts {
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
</style>
