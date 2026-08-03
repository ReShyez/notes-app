<template>
  <div class="default-layout">
    <div class="default-layout__container">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.default-layout {
  min-height: 100dvh;
  padding: 32px 24px;

  &__container {
    width: 100%;
    max-width: 1400px;
    margin-inline: auto;
  }

  @media (max-width: 767px) {
    padding: 20px 16px;
  }
}
</style>