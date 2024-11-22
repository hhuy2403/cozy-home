<template>
  <header class="header-component">
    <div class="menu-icon">
      <span></span>
    </div>
    <div class="action-buttons">
      <button class="green-button">
        <i class="fas fa-play"></i>
      </button>
      <button class="blue-button">
        <i class="fas fa-calculator"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
.header-component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0px;
  right: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.green-button,
.blue-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.green-button {
  background-color: #28a745; /* Green color */
}

.blue-button {
  background-color: #007bff; /* Blue color */
}

.green-button i,
.blue-button i {
  color: white;
  font-size: 1.2em;
}

</style>
