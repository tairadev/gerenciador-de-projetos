<template>
  <div class="toggle-favorite-container">
    <div class="toggle-favorite" :class="{ active: favoriteActive }"></div>
    <span>Apenas Favoritos</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  favoriteActive: boolean;
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.toggle-favorite-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  .toggle-favorite {
    position: relative;
    width: 48px;
    height: 24px;
    background: #53525d;
    border-radius: 12px;
    cursor: pointer;
    transition: background .2s;

    &:after {
      content: '';
      width: 12px;
      height: 12px;
      background: #ffffff;
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 50%;
      transition: left .2s;
    }

    &.active {
      background: #ffb23d;

      &:after {
        left: calc(100% - 18px);
      }
    }
  }

  span {
    color: #1c1930;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
  }
}
</style>
