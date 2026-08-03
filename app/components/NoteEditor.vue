<template>

  <form class="note-editor" @submit.prevent="saveNote">
    <h2 class="note-editor__title">
      {{ mode === 'create' ? 'Создание заметки' : 'Редактирование заметки' }}
    </h2>

    <div class="note-editor__history-controls">
      <BaseButton
          type="button"
          variant="tertiary"
          :is-disabled="!canUndo"
          @click="undo"
      >
        Отменить действие
      </BaseButton>

      <BaseButton
          type="button"
          variant="tertiary"
          :is-disabled="!canRedo"
          @click="redo"
      >
        Повторить действие
      </BaseButton>
    </div>
    <div class="note-editor__input-field">
      <label for="note-name" class="note-editor__name-label">Название заметки</label>
      <input :value="editableNote.name" id="note-name" name="note_name" class="note-editor__name" @input="changeNoteName"/>
    </div>



    <div class="note-editor__tasks">
      <h3 class="note-editor__tasks-title">Задачи</h3>
      <ul v-if="editableNote.tasks.length" class="note-editor__tasks-list">
        <TaskEditer v-for="task in editableNote.tasks"
                    :key="task.id" :task="task"
                    @remove-task="removeTask"
                    @update:complete="changeTaskComplete(task.id, $event)"
                    @update:name="changeTaskName(task.id, $event)"/>
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
      <BaseButton type="button" variant="tertiary" @click="openCancelModal">Отменить</BaseButton>
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
          variant="primary"
          autofocus
          @click="close"
      >
        Остаться
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

  <BaseModal
      v-if="isDraftModalOpen"
      title="Восстановить черновик?"
      description="Найдены несохранённые изменения после предыдущего редактирования."
      @close="discardDraft"
  >
    <template #actions>
      <BaseButton
          type="button"
          variant="tertiary"
          @click="discardDraft"
      >
        Отменить
      </BaseButton>

      <BaseButton
          type="button"
          variant="primary"
          autofocus
          @click="restoreDraft"
      >
        Восстановить
      </BaseButton>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">

import { useHistoryShortcuts } from '~/composables/useHistoryShortcuts'
import {useNotesStore} from "~/store/note/store.ts";
import type { Note, NoteDraft } from  '#shared/types/note';
import { useNoteStorage } from '~/composables/useNoteStorage';
import {debounce} from "~/services/helpers/debounce/debounce";
import {useHistory} from "~/composables/useHistory/useHistory.ts";
import BaseButton from "~/components/base-components/BaseButton.vue";
import BaseModal from "~/components/base-components/BaseModal.vue";

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

const pendingDraft = shallowRef<NoteDraft | null>(null);
const isDraftModalOpen = ref(false);

const emit = defineEmits<{
  (event: 'save', note: Note): void
  (event: 'cancel'): void
  (event: 'delete'): void
}>();


const {
  canUndo,
  canRedo,
  record,
  undo,
  redo,
  clearHistory
} = useHistory(editableNote)

const draftKey = computed(() => {
  return props.mode === 'create' ? 'note-new' : props.note.id;
})

const saveNote = () => {
  shouldSaveDraft = false

  editableNote.name =
      editableNote.name.trim() || 'Без названия'

  editableNote.tasks = editableNote.tasks
      .map(task => ({
        ...task,
        name: task.name.trim(),
      }))
      .filter(task => task.name.length > 0)

  removeDraft(draftKey.value)
  clearHistory()

  emit('save', toRaw(editableNote) )
}

const closeCancelModal = () : void => {
  isCancelModalOpen.value = false;
}

const openCancelModal = () : void => {
  isCancelModalOpen.value = true;
}

const confirmCancel = () : void => {
  removeDraft(draftKey.value);
  clearHistory();
  isCancelModalOpen.value = false;
  shouldSaveDraft = false;

  emit('cancel');
}

const restoreDraft = (): void => {
  if (!pendingDraft.value) {
    return
  }

  Object.assign(
      editableNote,
      structuredClone(pendingDraft.value.note),
  )

  clearHistory()

  pendingDraft.value = null
  isDraftModalOpen.value = false
}

const discardDraft = (): void => {
  removeDraft(draftKey.value)

  pendingDraft.value = null
  isDraftModalOpen.value = false
}

let noteNameBeforeChange: string | null = null;
const taskNamesBeforeChange = new Map<string, string>();
const taskNameDebounces = new Map<string, () => void>();

const recordNoteName = (): void => {
  if (noteNameBeforeChange === null ) return;

  record({
    type: 'change-name',
    before: noteNameBeforeChange,
    after: editableNote.name,
  });

  noteNameBeforeChange = null;
}

const commitNoteName = debounce(recordNoteName, 500)

const changeNoteName = (event: Event): void => {
  const input = event.target as HTMLInputElement

  if (noteNameBeforeChange === null) {
    noteNameBeforeChange = editableNote.name
  }

  editableNote.name = input.value
  commitNoteName();
}

const addTask = () => {
  const task = notesStore.createTask()
  const index = editableNote.tasks.length

  editableNote.tasks.push(task);

  record({
    type: 'add-task',
    task,
    index,
  })
}

const removeTask = (taskId: string): void => {
  const taskIndex = editableNote.tasks.findIndex(
      task => task.id === taskId,
  );

  if (taskIndex === -1) return;

  const task = editableNote.tasks[taskIndex];

  editableNote.tasks.splice(taskIndex, 1);

  if(task) {
    record({
      type: 'remove-task',
      task,
      index: taskIndex,
    });
  }


  taskNamesBeforeChange.delete(taskId);
  taskNameDebounces.delete(taskId);
}

const changeTaskComplete = (
    taskId: string,
    complete: boolean,
): void => {
  const task = editableNote.tasks.find(
      currentTask => currentTask.id === taskId,
  )

  if (!task || task.complete === complete) return;

  const previousComplete = task.complete;

  task.complete = complete;

  record({
    type: 'change-task-complete',
    taskId,
    before: previousComplete,
    after: complete,
  })
}

const recordTaskName = (taskId: string): void => {
  const task = editableNote.tasks.find(
      currentTask => currentTask.id === taskId,
  );

  const before = taskNamesBeforeChange.get(taskId);

  if(!task || before === undefined) return;

  record({
    type:'change-task-name',
    taskId,
    before,
    after: task.name,
  });

  taskNamesBeforeChange.delete(taskId);
};

const getTaskNameDebounce = (
    taskId: string,
): (() => void) => {
  const existingDebounce = taskNameDebounces.get(taskId)

  if (existingDebounce) {
    return existingDebounce
  }

  const newDebounce = debounce(() => {
    recordTaskName(taskId)
  }, 500)

  taskNameDebounces.set(taskId, newDebounce)

  return newDebounce
};

const changeTaskName = (
    taskId: string,
    name: string,
): void => {
  const task = editableNote.tasks.find(
      task => task.id === taskId,
  )

  if (!task) {
    return
  }

  if (!taskNamesBeforeChange.has(taskId)) {
    taskNamesBeforeChange.set(taskId, task.name)
  }

  task.name = name

  const saveChangeDebounced = getTaskNameDebounce(taskId)

  saveChangeDebounced()
};



const saveDraftDebounce = debounce((note : Note): void => {
  if(!shouldSaveDraft) return;

  saveDraft(draftKey.value, note)
}, 500)

useHistoryShortcuts({
  undo,
  redo,
  canUndo,
  canRedo,
})

onMounted(() => {
  const draft = loadDraft(draftKey.value);

  if (!draft) return;

  pendingDraft.value = structuredClone(draft)
  isDraftModalOpen.value = true
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
  &__title {
    text-align: center;
    margin-bottom: 25px;
  }

  &__history-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
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