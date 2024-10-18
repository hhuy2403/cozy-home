<template>
  <div class="landlord-layout">
    <LandlordSidebar /> <!-- Sidebar riêng cho landlord -->
    <div class="content">
      <router-view />    <!-- Nội dung của từng trang -->
    </div>
  </div>
</template>

<script>
import LandlordSidebar from '@/components/LandlordSidebar.vue';

export default {
  name: 'LandlordLayout',
  components: {
    LandlordSidebar
  }
}
</script>

<style scoped>
.landlord-layout {
  display: flex; /* Bố cục flex để sidebar và nội dung có thể nằm ngang */
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
  margin-left: 250px; /* Điều chỉnh khoảng cách để phù hợp với sidebar */
}
</style>
