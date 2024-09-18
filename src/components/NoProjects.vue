<template>
  <div class="app-no-projects">
    <h1>Nenhum projeto</h1>
    <p>Clique no botão abaixo para criar o primeiro e gerenciá-lo.</p>
    <Button class="button-primary" link="/novo" content="Novo projeto" icon="add" />
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';
</script>

<style lang="scss" scoped>
.app-no-projects {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  text-align: center;
  padding: 20px;
  gap: 20px;
  flex: 1;

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    color: #1f1283;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #717171;
  }
}
</style>
