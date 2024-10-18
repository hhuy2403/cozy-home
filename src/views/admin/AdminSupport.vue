<template>
  <div class="admin-support">
    <h1>Support Requests</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Issue</th>
        <th>Contact Info</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="request in supportRequests" :key="request.id">
        <td>{{ request.id }}</td>
        <td>{{ request.issue }}</td>
        <td>{{ request.contact }}</td>
        <td>{{ request.status }}</td>
        <td>
          <button @click="resolveRequest(request.id)">Resolve</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminSupport',
  data() {
    return {
      supportRequests: [
        { id: 1, issue: 'Tenant cannot access profile page.', contact: 'tenant@example.com', status: 'Pending' },
        { id: 2, issue: 'Landlord needs help with contract management.', contact: 'landlord@example.com', status: 'In Progress' }
      ]
    };
  },
  methods: {
    resolveRequest(id) {
      const request = this.supportRequests.find(req => req.id === id);
      if (request) {
        request.status = 'Resolved';
        alert('Support request resolved!');
      }
    }
  }
}
</script>

<style scoped>
.admin-support {
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
  background-color: #42b983;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
