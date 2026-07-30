<template>
  <main class="main-page">
    <ul class="main-page__list">
      <li class="main-page__list-item">
        <AddNoteCard/>
      </li>
      <li v-for="note in mokArray" :key="note.id" class="main-page__list-item">
        <NoteCard :note="note" @delete="openDeleteModal"/>
      </li>
    </ul>
  </main>


  <BaseModal
      v-if="noteIdToDelete"
      title="Удалить заметку?"
      description="Заметка и все её задачи будут удалены."
      @close="closeDeleteModal"
  >
    <template #actions>
      <BaseButton
          type="secondary"
          autofocus
          @click="closeDeleteModal"
      >
        Отмена
      </BaseButton>

      <BaseButton
          type="danger"
          @click="confirmDelete"
      >
        Удалить
      </BaseButton>
    </template>
  </BaseModal>

</template>

<script setup lang="ts">
import {useNotesStore} from "~/store/note/store.ts";

const notesStore = useNotesStore();

const noteIdToDelete = ref<string | null>(null);

const openDeleteModal = (noteId: string | null) => {
  noteIdToDelete.value = noteId;
}
const closeDeleteModal = () => {
  noteIdToDelete.value = null;
}

const confirmDelete = () => {

  console.log('Произошло удаление заметки- позже добавится работа со сторой')
  closeDeleteModal();
}
onMounted(() => {
  notesStore.initialize();

  console.log(notesStore);
})

const mokArray = [
  {
    id: '1',
    name: 'Задачи на понедельник',
    tasks: [

    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, {
    id: '2',
    name: 'Задачи на вторник',
    tasks: [
      {
        id: '1',
        name: 'Помыть посуду',
        complete: true,
      },

    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, {
    id: '3',
    name: 'Задачи на среду',
    tasks: [
      {
        id: '1',
        name: 'Помыть посуду',
        complete: true,
      },
      {
        id: '2',
        name: 'Почистить ковер',
        complete: false,
      },
      {
        id: '3',
        name: 'Погладить белье',
        complete: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Задачи на четверг',
    tasks: [
      {
        id: '1',
        name: 'Помыть посуду',
        complete: true,
      },
      {
        id: '2',
        name: 'Почистить ковер',
        complete: false,
      },
      {
        id: '3',
        name: 'Погладить белье',
        complete: false,
      },
      {
        id: '4',
        name: 'Покормить кота',
        complete: false,
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Задачи на пятницу',
    tasks: [
      {
        id: '1',
        name: 'Помыть посуду',
        complete: true,
      },
      {
        id: '2',
        name: 'Почистить ковер',
        complete: false,
      },
      {
        id: '3',
        name: 'Погладить белье',
        complete: false,
      },
      {
        id: '4',
        name: 'Покормить кота',
        complete: false,
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Задачи на субботу',
    tasks: [
      {
        id: '1',
        name: 'Помыть посуду',
        complete: true,
      },
      {
        id: '2',
        name: 'Почистить ковер',
        complete: false,
      },
      {
        id: '3',
        name: 'Погладить белье',
        complete: false,
      },
      {
        id: '4',
        name: 'Покормить кота',
        complete: false,
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];



</script>

<style lang="postcss" >
.main-page {
  max-width: 900px;

  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  }
}
</style>