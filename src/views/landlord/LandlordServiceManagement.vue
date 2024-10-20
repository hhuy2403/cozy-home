<template>
  <div class="landlord-service-management">
    <h1>Service Management</h1>
    <button @click="addService">Add New Service</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Service Name</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="service in services" :key="service.id">
        <td>{{ service.id }}</td>
        <td>{{ service.name }}</td>
        <td>{{ service.description }}</td>
        <td>
          <button @click="editService(service.id)">Edit</button>
          <button @click="deleteService(service.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordServiceManagement',
  data() {
    return {
      services: [
        { id: 1, name: 'Cleaning service', description: 'Weekly cleaning service' },
        { id: 2, name: 'Repair service', description: 'On-call repair service' }
      ]
    };
  },
  methods: {
    addService() {
      // Logic thêm dịch vụ
      alert('Add new service');
    },
    editService(id) {
      // Logic chỉnh sửa dịch vụ
      alert(`Edit service with ID: ${id}`);
    },
    deleteService(id) {
      // Logic xóa dịch vụ
      this.services = this.services.filter(service => service.id !== id);
      alert(`Service with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.landlord-service-management {
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
