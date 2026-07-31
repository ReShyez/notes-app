<template>
  <form class="note-editor" @submit.prevent="saveNote">
    <h2>
      {{ mode === 'create' ? 'Создание заметки' : 'Редактирование заметки' }}
    </h2>
    <div class="note-editor__input-field">
      <label for="note-name" class="note-editor__name-label">Название заметки</label>
      <input v-model="editableNote.name"  id="note-name" name="note_name" class="note-editor__name" />
    </div>



    <div class="note-editor__tasks">
      <h3 class="note-editor__tasks-title">Задачи</h3>
      <ul v-if="editableNote.tasks.length" class="note-editor__tasks-list">
        <TaskEditer v-for="task in editableNote.tasks"
                    :key="task.id" :task="task"
                    @remove-task="removeTask"
                    @update:complete="task.complete = $event"
                    @update:name="task.name = $event"/>
      </ul>

      <BaseButton type="button" variant="secondary" @click="addTask">Добавить задачу</BaseButton>
    </div>

    <div class="note-editor__footer">
      <BaseButton type="submit" variant="primary">Сохранить</BaseButton>
      <BaseButton
          v-if="mode === 'edit'"
          type="button"
          variant="danger"
          @click="emit('delete')"
      >
        Удалить
      </BaseButton>
      <BaseButton type="button" variant="danger" @click="openCancelModal">Отменить</BaseButton>
    </div>
  </form>

  <BaseModal
      v-if="isCancelModalOpen"
      title="Отменить изменения?"
      description="Все несохранённые изменения будут потеряны."
      @close="closeCancelModal"
  >
    <template #actions="{ close }">
      <BaseButton
          type="button"
          variant="secondary"
          autofocus
          @click="close"
      >
        Продолжить
      </BaseButton>

      <BaseButton
          type="button"
          variant="danger"
          @click="confirmCancel"
      >
        Отменить
      </BaseButton>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import {useNotesStore} from "~/store/note/store.ts";
import type { Note } from  '#shared/types/note';
import { useNoteStorage } from '~/composables/useNoteStorage';
import {debounce} from "~/services/helpers/debounce/debounce";

const props = defineProps<{
  note: Note;
  mode: 'create' | 'edit';
}>()

const {
  loadDraft,
  saveDraft,
  removeDraft,
} = useNoteStorage();

const notesStore = useNotesStore()
const editableNote: Note = reactive(structuredClone(toRaw(props.note)));
const isCancelModalOpen = ref(false);
let shouldSaveDraft = true;

const emit = defineEmits<{
  (event: 'save', note: Note): void
  (event: 'cancel'): void
  (event: 'delete'): void
}>();


const draftKey = computed(() => {
  return props.mode === 'create' ? 'note-new' : props.note.id;
})

const saveNote = () => {
  removeDraft(editableNote.id);
  shouldSaveDraft = false;

  emit('save', toRaw(editableNote) )
}

const closeCancelModal = () : void => {
  isCancelModalOpen.value = false;
}

const openCancelModal = () : void => {
  isCancelModalOpen.value = true;
}

const confirmCancel = () : void => {
  removeDraft(editableNote.id);
  isCancelModalOpen.value = false;
  shouldSaveDraft = false;

  emit('cancel');
}

const addTask = () => {
  editableNote.tasks.push(notesStore.createTask())
}

const removeTask = (taskId: string): void => {
  const taskIndex = editableNote.tasks.findIndex(
      task => task.id === taskId,
  )

  if (taskIndex !== -1) {
    editableNote.tasks.splice(taskIndex, 1)
  }
}

const saveDraftDebounce = debounce((note): void => {
  if(!shouldSaveDraft) return;

  saveDraft(draftKey.value, note)
}, 500)

onMounted(() => {
  const draft = loadDraft(draftKey.value);

  if (!draft) {
    return;
  }

  Object.assign(editableNote, structuredClone(draft.note));
})




watch(editableNote, () => {
  const note = toRaw(editableNote);
  saveDraftDebounce(note);
}, {
  deep: true
})
</script>

<style lang="postcss">
.note-editor {
    min-height: 600px;
    width: 600px;

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

  &__name-label {
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