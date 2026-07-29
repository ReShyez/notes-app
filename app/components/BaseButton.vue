<template>
  <button class="base-button" :class="`base-button_${type}`">
    <slot/>
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    type: 'primary' | 'secondary' | 'danger'
  }>()
</script>

<style lang="postcss">
.base-button {
  padding: 10px 15px;
  border-radius: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;

  box-shadow: 0 4px 14px rgba(99, 102, 241, .25);

  &_primary {
    background-color: #10b981;
  }

  &_primary:hover {
    background-color: #16a34a;;
  }

  &_secondary {
    background-color: #6366f1;
  }

  &_secondary:hover {
    background-color: #4f46e5;
  }

  &_danger {
      background-color: #ef4444;
    }

  &_danger:hover {
    background-color: #dc2626;
  }
}
.base-button:hover {
  transform: translateY(-1px);
}

.base-button:active {
  transform: translateY(1px) scale(.98);
}

.base-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, .2);
  outline-offset: 2px;
}
</style>