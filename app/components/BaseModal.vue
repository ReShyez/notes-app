<template>
  <Teleport to="body">
    <dialog
        ref="dialogRef"
        :aria-labelledby="title ? 'base-modal-title' : undefined"
        :aria-describedby="description ? 'base-modal-description' : undefined"
        class="base-modal"
        @cancel.prevent="closeModal"
        @click.stop = "closeModal"
>
      <div class="base-modal__wrapper">
        <div class="base-modal__header" @click.stop>
          <h2 v-if="title" class="base-modal__title">
            {{ title }}
          </h2>

          <BaseButton
              variant="secondary"
              class="base-modal__close-button base-modal__control-button"
              @click="closeModal">
            Закрыть
          </BaseButton>
        </div>

        <div class="base-modal__content" @click.stop>

          <p v-if="description" class="base-modal__description"> {{ description }}</p>

          <slot/>
        </div>

        <footer
            v-if="$slots.actions"
            class="base-modal__actions"
        >
          <slot
              name="actions"
              :close="closeModal"
          />
        </footer>
      </div>

    </dialog>
  </Teleport>

</template>

<script setup lang="ts">

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(),{
  title: '',
  description: ''
})

const dialogRef = ref<HTMLDialogElement | null>(null);

const emit = defineEmits<{
  close: []
}>();

const closeModal = (): void => {
  dialogRef.value?.close()
  emit('close')
}

onMounted(async () => {
  const dialog = dialogRef.value

  if (!dialog) {
    return
  }

  dialog.showModal();

})
</script>

<style lang="postcss">

.base-modal {
  height: min(320px, calc(100% - 32px));
  padding: 0;

  color: #111827;
  background-color: #fff;
  border: none;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgb(0 0 0 / 30%);

  &::backdrop {
    background-color: rgb(17 24 39 / 70%);
    backdrop-filter: blur(8px);
  }

  &__wrapper {
    height: 100%;
    display: flex;
    padding: 24px;
    flex-direction: column;
    justify-content: space-between;

  }
  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  &__title {
    margin: 0;
    font-size: 32px;
  }

  &__description {
    margin: 0;
    color: #4b5563;
    font-size: 24px;
    max-width: 300px;

  }

  &__actions {
    display: flex;
    justify-content: space-between;

    gap: 12px;
  }
}
</style>