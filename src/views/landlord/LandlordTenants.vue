<template>
  <div class="landlord-tenants">
    <h1>Tenant Management</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Property</th>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tenant in tenants" :key="tenant.id">
        <td>{{ tenant.id }}</td>
        <td>{{ tenant.name }}</td>
        <td>{{ tenant.property }}</td>
        <td>{{ tenant.startDate }}</td>
        <td>{{ tenant.endDate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordTenants',
  data() {
    return {
      tenants: [
        { id: 1, name: 'John Doe', property: 'Apartment A', startDate: '2023-01-01', endDate: '2023-12-31' },
        { id: 2, name: 'Jane Smith', property: 'Villa B', startDate: '2023-05-01', endDate: '2024-04-30' }
      ]
    };
  }
}
</script>

<style scoped>
.landlord-tenants {
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
