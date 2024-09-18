<template>
  <Menu />
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue';
</script>

<style lang="scss" scoped>
.app-container {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  background: #F4F2FF;
  padding: 60px 42px;
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
}
</style>
