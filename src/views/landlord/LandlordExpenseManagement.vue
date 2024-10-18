<template>
  <div class="landlord-expense-management">
    <h1>Expense Management</h1>
    <button @click="addExpense">Add New Expense</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="expense in expenses" :key="expense.id">
        <td>{{ expense.id }}</td>
        <td>{{ expense.description }}</td>
        <td>{{ expense.amount }}</td>
        <td>{{ expense.date }}</td>
        <td>
          <button @click="editExpense(expense.id)">Edit</button>
          <button @click="deleteExpense(expense.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordExpenseManagement',
  data() {
    return {
      expenses: [
        { id: 1, description: 'Repair bathroom', amount: '200 USD', date: '2023-08-10' },
        { id: 2, description: 'Air conditioner maintenance', amount: '100 USD', date: '2023-07-15' }
      ]
    };
  },
  methods: {
    addExpense() {
      // Logic thêm chi phí
      alert('Add new expense');
    },
    editExpense(id) {
      // Logic chỉnh sửa chi phí
      alert(`Edit expense with ID: ${id}`);
    },
    deleteExpense(id) {
      // Logic xóa chi phí
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      alert(`Expense with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.landlord-expense-management {
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
