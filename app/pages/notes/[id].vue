<template>
  <section class="note-card-editor">
    <NoteEditor
        v-if="editableNote"
        :note="editableNote"
        mode="edit"
        @cancel="confirmCancel"
        @delete="openDeleteModal"
        @save="saveNote"
    />

    <div v-else-if="notesStore.initialized">
      Заметка не найдена

      <NuxtLink to="/">
      На главную
      </NuxtLink>
    </div>

    <div v-else>
      Загрузка...
    </div>
  </section>

  <BaseModal
      v-if="isOpenDeleteModal"
      title="Удалить заметку?"
      description="Заметка и все её задачи будут удалены."
      @close="closeDeleteModal"
  >
    <template #actions>
      <BaseButton
          variant="primary"
          autofocus
          @click="closeDeleteModal"
      >
        Отмена
      </BaseButton>

      <BaseButton
          variant="danger"
          @click="confirmDelete"
      >
        Удалить
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Note } from '#shared/types/note'
import {useNotesStore} from "~/store/note/store.ts";

const route = useRoute();
const noteId = computed(()=> String(route.params.id));

const isOpenDeleteModal = ref<boolean>(false);

const notesStore = useNotesStore();

const editableNote = computed<Note | undefined>(() => {
  return notesStore.getNoteById(noteId.value)
})

console.log(editableNote)




const saveNote = async (note: Note) => {
  notesStore.saveNote(toRaw(note));

  await navigateTo('/');
}

const confirmCancel = async () => {
  await navigateTo('/')
}

const closeDeleteModal = () => {
  isOpenDeleteModal.value = false;
}

const openDeleteModal = (): void => {
  isOpenDeleteModal.value = true
}

const confirmDelete = () => {

  console.log('Произошло удаление заметки- позже добавится работа со сторой')

  notesStore.deleteNote(noteId.value)
  closeDeleteModal();

}

onMounted(() => {
  notesStore.initialize()
})
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