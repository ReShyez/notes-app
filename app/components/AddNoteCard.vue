<script setup lang="ts">
</script>
<template>
  <NuxtLink class="add-note-card" to="/notes/new">
    <span class="add-note-card__text">Добавить заметку</span>
    <span class="add-note-card__icon" aria-hidden="true"></span>

  </NuxtLink>
</template>

<style lang="postcss">
.add-note-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 12px;
  aspect-ratio: 1;
  border: 4px dashed #e4e2e2;
  border-radius: 36px;

  &:focus-visible {
    color: #2563eb;
    border-color: #2563eb;
    outline: 3px solid rgb(37 99 235 / 25%);
    outline-offset: 4px;
  }

  &:active {
    transform: scale(0.97);
  }

  &__text {
    font-size: 32px;
    text-align: center;
  }

  &__icon {
    position: relative;
    width: 64px;
    height: 64px;
    border: 2px solid currentColor;
    border-radius: 50%;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 24px;
      height: 3px;
      border-radius: 2px;
      background-color: currentColor;
      transform: translate(-50%, -50%);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
}
</style>