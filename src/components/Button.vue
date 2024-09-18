<template>
  <router-link :to="link" class="button-base" :title="content" v-if="link">
    <img v-if="icon" :src="`/${icon}.svg`" :alt="icon" :title="content" />
    {{ content }}
  </router-link>
  <button
    v-else
    @click="handleClick"
    class="button-base"
    :disabled="disabled || !clickFunction"
  >
    <img v-if="icon" :src="`/${icon}.svg`" :alt="icon" :title="content" />
    {{ content }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  link?: string;
  content?: string;
  icon?: string;
  clickFunction?: (event: MouseEvent) => void;
  disabled?: boolean;
}

const props = defineProps<Props>();

const handleClick = (event: MouseEvent) => {
  props.clickFunction?.(event);
};
</script>

<style lang="scss" scoped>
.button-base {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 35px;
  border-radius: 30px;
  cursor: pointer;
  transition: opacity 0.2s;
  border: none;
  font-size: 20px;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.smaller {
    font-size: 16px;
    line-height: 24px;
    padding: 8px 25px;
  }

  &.button-primary {
    background: #695ccd;
    color: #ffffff;
  }

  &.button-secondary {
    background: #ffffff;
    border: 1px solid #695ccd;
    color: #695ccd;
  }

  &.full-width {
    width: 100%;
  }
}
</style>
