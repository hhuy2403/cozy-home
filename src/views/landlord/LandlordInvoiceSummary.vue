<template>
  <div class="landlord-invoice-summary">
    <h1>Invoice Summary for Tenant {{ tenantName }} (Room {{ roomName }})</h1>
    <table>
      <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Room Rent</td>
        <td>{{ rent }} USD</td>
      </tr>
      <tr>
        <td>Service Fee</td>
        <td>{{ serviceFee }} USD</td>
      </tr>
      <tr>
        <td>Electricity ({{ electricityUsage }} kWh)</td>
        <td>{{ electricityCost }} USD</td>
      </tr>
      <tr>
        <td>Water ({{ waterUsage }} m³)</td>
        <td>{{ waterCost }} USD</td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>{{ total }} USD</strong></td>
      </tr>
      </tbody>
    </table>
    <button @click="generateInvoice">Generate Invoice</button>
  </div>
</template>

<script>
export default {
  name: 'LandlordInvoiceSummary',
  props: ['roomId'], // Nhận roomId từ route params
  data() {
    return {
      tenantName: 'John Doe', // Tên người thuê (lấy từ dữ liệu thực tế)
      roomName: 'Sample room Name', // Thay bằng dữ liệu thực tế từ roomId
      rent: 500, // Tiền thuê phòng
      serviceFee: 50, // Tiền dịch vụ
      electricityUsage: 120, // kWh
      electricityCost: 30, // Giá điện
      waterUsage: 15, // m³
      waterCost: 10, // Giá nước
    };
  },
  computed: {
    total() {
      return this.rent + this.serviceFee + this.electricityCost + this.waterCost;
    }
  },
  methods: {
    generateInvoice() {
      // Logic để tạo hóa đơn
      alert(`Invoice generated for ${this.tenantName}`);
    }
  },
  created() {
    // Logic để lấy tên phòng và tên người thuê từ roomId
    this.roomName = 'room 101'; // Ví dụ tạm thời
    this.tenantName = 'John Doe'; // Ví dụ tạm thời
  }
}
</script>

<style scoped>
.landlord-invoice-summary {
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
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
