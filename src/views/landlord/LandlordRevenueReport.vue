<template>
  <div class="landlord-revenue-report">
    <h1>Revenue Report</h1>
    <table>
      <thead>
      <tr>
        <th>Month</th>
        <th>Total Income</th>
        <th>Paid</th>
        <th>Pending</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in revenueReports" :key="report.month">
        <td>{{ report.month }}</td>
        <td>{{ report.totalIncome }}</td>
        <td>{{ report.paid }}</td>
        <td>{{ report.pending }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordRevenueReport',
  data() {
    return {
      revenueReports: [
        { month: 'August 2023', totalIncome: '2000 USD', paid: '1800 USD', pending: '200 USD' },
        { month: 'July 2023', totalIncome: '2500 USD', paid: '2500 USD', pending: '0 USD' }
      ]
    };
  }
}
</script>

<style scoped>
.landlord-revenue-report {
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
