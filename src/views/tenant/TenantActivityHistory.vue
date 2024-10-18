<template>
  <div class="tenant-activity-history">
    <h1>Activity History</h1>
    <table>
      <thead>
      <tr>
        <th>Date</th>
        <th>Activity</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="activity in activities" :key="activity.id">
        <td>{{ activity.date }}</td>
        <td>{{ activity.type }}</td>
        <td>{{ activity.details }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TenantActivityHistory',
  data() {
    return {
      activities: [
        {id: 1, date: '2023-08-01', type: 'Payment', details: 'Paid 500 USD for August rent'},
        {id: 2, date: '2023-07-31', type: 'Contract', details: 'Signed contract for Apartment A'}
      ]
    };
  }
}
</script>

<style scoped>
.tenant-activity-history {
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
