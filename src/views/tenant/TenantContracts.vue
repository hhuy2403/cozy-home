<template>
  <div class="tenant-contracts">
    <h1>Contracts</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Property</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="contract in contracts" :key="contract.id">
        <td>{{ contract.id }}</td>
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
  name: 'TenantContracts',
  data() {
    return {
      contracts: [
        { id: 1, property: 'Apartment A', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
        { id: 2, property: 'Villa B', startDate: '2022-01-01', endDate: '2022-12-31', status: 'Completed' }
      ]
    };
  }
}
</script>

<style scoped>
.tenant-contracts {
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
