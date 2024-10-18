<template>
  <div class="tenant-support">
    <h1>Support</h1>
    <form @submit.prevent="submitSupportRequest">
      <div>
        <label for="issue">Issue:</label>
        <textarea id="issue" v-model="supportRequest.issue" placeholder="Describe your issue" required></textarea>
      </div>
      <div>
        <label for="contact">Contact Info:</label>
        <input type="text" id="contact" v-model="supportRequest.contact" placeholder="Your email or phone number" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TenantSupport',
  data() {
    return {
      supportRequest: {
        issue: '',
        contact: ''
      }
    };
  },
  methods: {
    submitSupportRequest() {
      console.log('Support request submitted:', this.supportRequest);
      // Logic gửi yêu cầu hỗ trợ
      alert('Your support request has been submitted.');
      this.supportRequest.issue = '';
      this.supportRequest.contact = '';
    }
  }
}
</script>

<style scoped>
.tenant-support {
  padding: 20px;
}
form div {
  margin-bottom: 10px;
}
textarea, input {
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
