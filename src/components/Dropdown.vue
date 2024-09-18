<template>
  <div class="dropdown-container" :class="{ opened: props.opened }">
    {{ selectedOrderLabel }}
    <img src="../assets/icons/arrow.svg" alt="Abrir">
    <ul>
      <li @click="() => setOrder('alphabetical')">Ordem alfabética</li>
      <li @click="() => setOrder('recent')">Iniciados mais recentes</li>
      <li @click="() => setOrder('end')">Prazo mais próximo</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  opened: boolean;
  selectedOrder: string;
  setOrder: (order: string) => void;
}

const props = defineProps<Props>();

const selectedOrderLabel = computed(() => {
  switch (props.selectedOrder) {
    case 'end':
      return 'Prazo mais próximo';
    case 'recent':
      return 'Iniciados mais recentes';
    default:
      return 'Ordem alfabética';
  }
});
</script>

<style lang="scss" scoped>
.dropdown-container {
  position: relative;
  border-radius: 8px;
  border: 1px solid #717171;
  background: #fff;
  width: 296px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  cursor: pointer;
  z-index: 1;

  ul {
    display: none;
    width: calc(100% + 2px);
    list-style: none;
    padding: 0;
    position: absolute;
    left: -1px;
    top: 38px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border: 1px solid #695ccd;
    border-radius: 0 0 16px 16px;
    overflow: hidden;

    li {
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      color: #1c1930;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px;
      padding: 11px 16px;
      background: #fff;
      border-bottom: 1px solid #ececec;
      cursor: pointer;
      transition: background 0.1s;

      &:last-child {
        border: none;
      }

      &:hover {
        background: #ececec;
      }
    }
  }

  &.opened {
    border-radius: 8px 8px 0 0;
    border-color: #695ccd;

    ul {
      display: block;
    }
  }

  @media (max-width: 992px) {
    width: 200px;
  }
  @media (max-width: 576px) {
    width: 100%;
  }
}
</style>
