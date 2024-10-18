<template>
  <div class="change-password-page">
    <h1>Change Password</h1>
    <form @submit.prevent="changePassword">
      <div>
        <label for="current-password">Current Password:</label>
        <input type="password" v-model="passwords.current" id="current-password" required />
      </div>
      <div>
        <label for="new-password">New Password:</label>
        <input type="password" v-model="passwords.new" id="new-password" required />
      </div>
      <div>
        <label for="confirm-password">Confirm New Password:</label>
        <input type="password" v-model="passwords.confirm" id="confirm-password" required />
      </div>
      <button type="submit">Change Password</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: ''
      }
    };
  },
  methods: {
    changePassword() {
      if (this.passwords.new !== this.passwords.confirm) {
        alert('New password and confirm password do not match!');
        return;
      }
      // Logic để xác thực mật khẩu hiện tại và cập nhật mật khẩu mới
      console.log('Password changed successfully.');
      alert('Your password has been changed.');
    }
  }
}
</script>

<style scoped>
.change-password-page {
  padding: 20px;
}
form div {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
}
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
