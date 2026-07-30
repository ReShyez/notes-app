<template>
  <article class="note-card">
    <div class="note-card__content">
      <h2 class="note-card__name">{{trimString(note.name, 60)}}</h2>

      <ul class="note-card__task-list" v-if="note.tasks.length">
        <li class="note-card__task-item" v-for="task in previewTasks" :key="task.id">
          <div class="note-card__task-wrapper">
            <span
                class="note-card__task-status"
                :class="{
                'note-card__task-status_complete': task.complete,
                'note-card__task-status_incomplete': !task.complete,
              }"
                aria-hidden="true"
            />

            <span class="note-card__task-name note-card__task-text" :class="{ 'note-card__task-name_complete': task.complete }">
              {{ task.name }}
            </span>
          </div>
        </li>
      </ul>

      <span class="note-card__task-text" v-else>
        Кажется задачи еще не заданы
      </span>

      <span v-if="hideTasks > 0" class="note-card__task-text">
        Скрыто задач: {{hideTasks}}
      </span>
    </div>
    <div class="note-card__buttons">

      <NuxtLink class="note-card__edit-button" :to="`/notes/${note.id}`">
        Редактировать
      </NuxtLink>

      <BaseButton variant="danger" @click="emit('delete', note.id)">Удалить</BaseButton>
    </div>

  </article>
</template>

<script setup lang="ts">
import type { Note } from '#shared/types/note';
import {trimString} from "~/services/helpers/trim-string/trimstring";

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  delete: [noteId: string]
}>()

const previewTasks = computed(()=>{
  return props.note.tasks.slice(0, 3)
});

const hideTasks = computed(()=>{
  return props.note.tasks.length - previewTasks.value.length
})
</script>
<style lang="postcss">
.note-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  gap: 12px;
  aspect-ratio: 1;
  border: 4px solid #e4e2e2;
  border-radius: 36px;

  &:focus-within {
    border-color: #2563eb;
    outline: 3px solid rgb(37 99 235 / 25%);
    outline-offset: 4px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }

  &__name {
    font-size: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }

  &__task-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__task-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    gap: 6px;
  }

  &__task-text {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  &__edit-button {
    padding: 10px 15px;
    border-radius: 16px;
    display: inline-flex;
    color: #000;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    background-color: #10b981;

    &:hover {
      background-color: #16a34a;
    }
  }

  &__task-status {
    position: relative;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border: 2px solid currentColor;
    border-radius: 50%;

    &_complete {
      color: #16a34a;

      &::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 8px;
        width: 5px;
        height: 9px;
        border-right: 3px solid currentColor;
        border-bottom: 3px solid currentColor;
        transform: rotate(45deg);
      }
    }

    &_incomplete {
      color: #ef4444;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 2px;
        border-radius: 2px;
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
}

</style>