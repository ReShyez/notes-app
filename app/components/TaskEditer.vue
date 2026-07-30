
<template>
  <li class="task-editor-item">
    <input
      :id="`task-complete-${task.id}`"
      :checked="task.complete"
      class="task-editor-item__status"
      type="checkbox"
      :aria-label="`Отметить задачу «${task.name || 'Без названия'}» выполненной`"
      @change="changeStatus"
    >
    <div class="task-editor-item__input-wrapper">
      <label
          :for="`task-name-${task.id}`"
          class="task-editor-item__label"
      >
        Название задачи
      </label>

      <input
          :id="`task-name-${task.id}`"
          :value="task.name"
          :name="`task-${task.id}`"
          class="task-editor-item__name"
          type="text"
          placeholder="Введите название задачи"
          @input="changeName"
      >
    </div>

    <button class="task-editor-item__delete-button" aria-label="Удалить задачу">
      <span class="task-editor-item__button-icon" aria-hidden="true"></span>
    </button>
  </li>

</template>

<script setup lang="ts">
defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:complete': [value: boolean]
  removeTask: [taskId: string]
}>()


const changeName = (event: Event): void => {
  const input = event.target as HTMLInputElement

  emit('update:name', input.value)
}

const changeStatus = (event: Event): void => {
  const input = event.target as HTMLInputElement

  emit('update:complete', input.checked)
}
</script>

<style>
.task-editor-item {
  display: flex;
  align-items: center;
  gap: 12px;

  &__status {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 12px;
  }

  &__label {
    position: absolute;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  &__input-wrapper {
    width: 100%;
  }
  &__name {
    flex-grow: 1;
    width: 100%;
    height: 40px;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    font: inherit;
  }

  &__delete-button {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 12px;
  }

  &__button-icon {
    position: relative;
    width: 30px;
    height: 30px;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 2px;

      background-color: currentColor;
    }

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>