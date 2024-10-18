<template>
  <div class="tenant-payment-history">
    <h1>Payment History</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Date</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="payment in payments" :key="payment.id">
        <td>{{ payment.id }}</td>
        <td>{{ payment.date }}</td>
        <td>{{ payment.amount }}</td>
        <td>{{ payment.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TenantPaymentHistory',
  data() {
    return {
      payments: [
        { id: 1, date: '2023-08-01', amount: '500 USD', status: 'Paid' },
        { id: 2, date: '2023-09-01', amount: '500 USD', status: 'Pending' }
      ]
    };
  }
}
</script>

<style scoped>
.tenant-payment-history {
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
