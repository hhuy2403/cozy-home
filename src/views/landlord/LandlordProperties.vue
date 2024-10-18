<template>
  <div class="landlord-properties">
    <h1>Property Management</h1>
    <button @click="addProperty">Add New Property</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Location</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="property in properties" :key="property.id">
        <td>{{ property.id }}</td>
        <td>{{ property.name }}</td>
        <td>{{ property.location }}</td>
        <td>
          <button @click="editProperty(property.id)">Edit</button>
          <button @click="deleteProperty(property.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordProperties',
  data() {
    return {
      properties: [
        { id: 1, name: 'Apartment A', location: 'Downtown' },
        { id: 2, name: 'Villa B', location: 'Suburbs' }
      ]
    };
  },
  methods: {
    addProperty() {
      // Logic thêm mới tài sản
      console.log('Add new property');
    },
    editProperty(id) {
      // Logic chỉnh sửa tài sản
      console.log('Edit property with id:', id);
    },
    deleteProperty(id) {
      // Logic xóa tài sản
      this.properties = this.properties.filter(property => property.id !== id);
    }
  }
}
</script>

<style scoped>
.landlord-properties {
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
