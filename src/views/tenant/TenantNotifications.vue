<template>
  <div class="tenant-notifications">
    <h1>Notifications</h1>
    <ul>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.message }} - <strong>{{ notification.date }}</strong>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TenantNotifications',
  data() {
    return {
      notifications: [
        { id: 1, message: 'Your payment for August has been received.', date: '2023-08-05' },
        { id: 2, message: 'Your contract for Apartment A is about to expire.', date: '2023-07-25' }
      ]
    };
  }
}
</script>

<style scoped>
.tenant-notifications {
  padding: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
}
strong {
  color: #42b983;
}
</style>
