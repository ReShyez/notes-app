import {
    computed,
    shallowRef,
    toRaw,
} from 'vue'
import type {HistoryActions, HistoryDirection} from "~/composables/useHistory/type.ts";
import {MAX_HISTORY_LENGTH} from "~/composables/useHistory/constants.ts";


const cloneTask = (task: Task): Task => {
    return structuredClone(toRaw(task))
}

export const useHistory = (note: Note) => {
    const undoStack = shallowRef<HistoryActions[]>([]);
    const redoStack = shallowRef<HistoryActions[]>([]);

    const findTask = (id: string): Task | undefined  => {
        return note.tasks.find((task) => task.id === id);
    };

    const removeTask = (id: string) => {
        const taskIndex = note.tasks.findIndex(task => task.id === id);

        if (taskIndex !== -1) {
            note.tasks.splice(taskIndex, 1);
        }
    };

    const insertTask = (task: Task, index: number) => {
        note.tasks.splice(index, 0, cloneTask(task));
    };

    const applyAction = (action: HistoryActions, direction: HistoryDirection) => {
        switch (action.type) {
            case 'change-name': {
                note.name = direction === 'undo' ? action.before : action.after;

                break
            }

            case 'change-task-name': {
                const task = findTask(action.taskId);
                if (!task) return;

                task.name = direction === 'undo' ? action.before : action.after;

                break
            }

            case 'change-task-complete': {
                const task = findTask(action.taskId);
                if (!task) return;

                task.complete = direction === 'undo' ? action.before : action.after;

                break
            }

            case 'add-task': {
                if(direction === 'undo') {
                    removeTask(action.task.id)
                } else {
                    insertTask(action.task, action.index);
                }
                break
            }

            case 'remove-task': {
                if (direction === 'undo') {
                    insertTask(action.task, action.index);
                } else {
                    removeTask(action.task.id);
                }
                break
            }
        }
    };

    const record = ( action: HistoryActions, ): void => {
        const storedAction: HistoryActions =
            action.type === 'add-task' || action.type === 'remove-task'
                ? {
                    ...action,
                    task: cloneTask(action.task),
                }
                : action

        undoStack.value = [
            ...undoStack.value,
            storedAction,
        ].slice(-MAX_HISTORY_LENGTH);

        redoStack.value = []
    };

    const undo = (): void => {
        const action = undoStack.value.at(-1)

        if (!action) {
            return
        }

        undoStack.value = undoStack.value.slice(0, -1)

        applyAction(action, 'undo')

        redoStack.value = [
            ...redoStack.value,
            action,
        ]
    };

    const redo = (): void => {
        const action = redoStack.value.at(-1)

        if (!action) {
            return
        }

        redoStack.value = redoStack.value.slice(0, -1)

        applyAction(action, 'redo')

        undoStack.value = [
            ...undoStack.value,
            action,
        ].slice(-MAX_HISTORY_LENGTH)
    };

    const clearHistory = (): void => {
        undoStack.value = []
        redoStack.value = []
    };

    const canUndo = computed(() => {
        return undoStack.value.length > 0
    });

    const canRedo = computed(() => {
        return redoStack.value.length > 0
    });


    return {
        canUndo,
        canRedo,
        record,
        undo,
        redo,
        clearHistory,
    }
}