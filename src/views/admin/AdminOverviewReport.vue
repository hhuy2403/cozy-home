<template>
  <div class="admin-overview-report">
    <h1>System Overview Report</h1>
    <div class="report">
      <h2>Total Tenants: {{ tenantCount }}</h2>
      <h2>Total Landlords: {{ landlordCount }}</h2>
      <h2>Total Properties: {{ propertyCount }}</h2>
      <h2>Total Revenue: {{ totalRevenue }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOverviewReport',
  data() {
    return {
      tenantCount: 100,
      landlordCount: 50,
      propertyCount: 200,
      totalRevenue: '500,000 USD'
    };
  }
}
</script>

<style scoped>
.admin-overview-report {
  padding: 20px;
}
.report {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
}
h2 {
  color: #2a3f54;
}
</style>
