import type { Task } from '#shared/types/note';

export type HistoryDirection = 'undo' | 'redo';

export type HistoryActions =
    | {
        type: 'change-name'
        before: string,
        after: string,
    }
    | {
        type: 'change-task-name'
        taskId: string,
        before: string,
        after: string,
    }
    | {
        type: 'change-task-complete'
        taskId: string,
        before: boolean,
        after: boolean,
    }
    | {
        type: 'add-task'
    task: Task,
    index: number,
    }
    | {
        type: 'remove-task'
        task: Task,
        index: number,
    }