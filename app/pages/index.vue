<template>
  <main class="main-page">
    <ul v-if="notesStore.getInitialized" class="main-page__list">
      <li class="main-page__list-item">
        <AddNoteCard/>
      </li>
      <li v-for="note in notesStore.notes" :key="note.id" class="main-page__list-item">
        <NoteCard :note="note" @delete="openDeleteModal"/>
      </li>
    </ul>

    <div v-else class="main-page__initilize">Загрузка данных..</div>
  </main>


  <BaseModal
      v-if="noteIdToDelete"
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
import {useNotesStore} from "~/store/note/store.ts";
import { useNotesSync } from '~/composables/useNotesSync';
import BaseModal from "~/components/base-components/BaseModal.vue";
import BaseButton from "~/components/base-components/BaseButton.vue";

const notesStore = useNotesStore();

const noteIdToDelete = ref<string | null>(null);

const openDeleteModal = (noteId: string | null) => {
  noteIdToDelete.value = noteId;
}
const closeDeleteModal = () => {
  noteIdToDelete.value = null;
}

const confirmDelete = () => {

  if(noteIdToDelete.value){
    notesStore.deleteNote(toRaw(noteIdToDelete.value))
    closeDeleteModal();
  }

}

useNotesSync({
  onChange: notes => {
    notesStore.replaceNotes(notes);
  },
});

onMounted(() => {
  notesStore.initialize()
})
</script>

<style lang="postcss" >
.main-page {
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
    gap: 24px;
  }

  &__initilize {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 36px;
  }
}
</style>