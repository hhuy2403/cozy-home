<template>
  <aside>
    <ul>
      <li>
        <router-link to="/landlord/dashboard">Dashboard</router-link>
      </li>
      <li>
        <router-link to="/landlord/properties">Properties</router-link>
      </li>
      <li>
        <router-link to="/landlord/contracts">Contracts</router-link>
      </li>
      <li>
        <router-link to="/landlord/room-management">Room Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/service-management">Service Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/invoice-summary">Invoices</router-link>
      </li>
      <li>
        <router-link to="/landlord/deposit-management">Deposit Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/expense-management">Expense Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/meter-management">Meter Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/room-asset-management">Room Asset Management</router-link>
      </li>
      <li>
        <router-link to="/landlord/room-member-management">Room Member Management</router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'LandlordSidebar'
}
</script>

<style scoped>
aside {
  width: 250px;
  background-color: #2a3f54;
  color: white;
  padding: 10px;
  height: 100vh;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 15px;
}

ul li a {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
}

ul li a:hover {
  text-decoration: underline;
}
</style>
