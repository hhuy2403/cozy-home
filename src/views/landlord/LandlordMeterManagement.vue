<template>
  <div class="landlord-meter-management">
    <h1>Electricity & Water Meter Management</h1>
    <button @click="addMeter">Add New Meter Reading</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Room Name</th>
        <th>Electricity Reading (kWh)</th>
        <th>Water Reading (m³)</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="meter in meters" :key="meter.id">
        <td>{{ meter.id }}</td>
        <td>{{ meter.roomName }}</td>
        <td>{{ meter.electricity }}</td>
        <td>{{ meter.water }}</td>
        <td>{{ meter.date }}</td>
        <td>
          <button @click="editMeter(meter.id)">Edit</button>
          <button @click="deleteMeter(meter.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LandlordMeterManagement',
  data() {
    return {
      meters: [
        { id: 1, roomName: 'room A', electricity: 120, water: 15, date: '2023-09-01' },
        { id: 2, roomName: 'room B', electricity: 150, water: 18, date: '2023-09-01' }
      ]
    };
  },
  methods: {
    addMeter() {
      // Logic thêm chỉ số điện/nước mới
      alert('Add new meter reading');
    },
    editMeter(id) {
      // Logic chỉnh sửa chỉ số điện/nước
      alert(`Edit meter with ID: ${id}`);
    },
    deleteMeter(id) {
      // Logic xóa chỉ số điện/nước
      this.meters = this.meters.filter(meter => meter.id !== id);
      alert(`Meter with ID: ${id} deleted`);
    }
  }
}
</script>

<style scoped>
.landlord-meter-management {
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
