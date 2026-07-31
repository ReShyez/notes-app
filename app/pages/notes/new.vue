<template>
  <section class="note-card-editor">
    <NoteEditor
      :note="editableNote"
      mode="create"
      @cancel="confirmCancel"
      @save="saveNote"
    />
  </section>

</template>

<script setup lang="ts">
import type { Note } from '#shared/types/note'
import {useNotesStore} from "~/store/note/store.ts";

const notesStore = useNotesStore();
const editableNote = notesStore.createNote();

const saveNote = async (note: Note) => {
  notesStore.saveNote(toRaw(note));

  await navigateTo('/');
}

const confirmCancel = async () => {
  await navigateTo('/')
}

</script>

<style>
.note-card-editor {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__form {
    min-height: 600px;
    width: 600px;
  }

  &__input-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;


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

  &__name-lable {
    font-size: 20px;
    margin-bottom: 6px;
  }

  &__tasks {
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__tasks-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
  }

  &__footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>