<template>
  <div class="tenant-profile">
    <h1>Profile</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="profile.name" id="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="profile.email" id="email" />
      </div>
      <div>
        <label for="phone">Phone:</label>
        <input type="tel" v-model="profile.phone" id="phone" />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TenantProfile',
  data() {
    return {
      profile: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789'
      }
    };
  },
  methods: {
    updateProfile() {
      console.log('Profile updated:', this.profile);
      // Logic cập nhật hồ sơ
    }
  }
}
</script>

<style scoped>
.tenant-profile {
  padding: 20px;
}
form div {
  margin-bottom: 10px;
}
label {
  margin-right: 10px;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
