import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest'
import { reactive } from 'vue'

import type { Note, Task } from '#shared/types/note';
import { useHistory } from '~/composables/useHistory/useHistory';

const createNote = (): Note => ({
    id: 'note-1',
    name: 'Старое название',
    tasks: [],
    createdAt: '1999-01-01T00:01',
    updatedAt: '1999-01-01T00:01',
});

const createTask = (
    overrides: Partial<Task> = {},
): Task => ({
    id: 'task-1',
    name: 'Первая задача',
    complete: false,
    ...overrides,
})

describe('useHistory', () => {
    let note: Note
    let history: ReturnType<typeof useHistory>

    beforeEach(() => {
        note = reactive(createNote());
        history = useHistory(note);
    })

    it('Отмена извеменения заметки (undo)', () => {
        note.name = 'Новое название';

        history.record({
            type: 'change-name',
            before: 'Старое название',
            after: 'Новое название',
        });

        history.undo();

        expect(note.name).toBe('Старое название');
        }
    );

    it('Возврат названия после отмены (redo)', () => {
            note.name = 'Новое название';

            history.record({
                type: 'change-name',
                before: 'Старое название',
                after: 'Новое название',
            });

            history.undo();
            history.redo();

            expect(note.name).toBe('Новое название');
        }
    )

    it('Изменение статуса задачи (undo)', () => {
        const task = createTask();
        task.complete = true;

        note.tasks.push(task);
        history.record({
            type: 'change-task-complete',
            taskId: task.id,
            before: false,
            after: true,
        });

        history.undo();

        expect(note.tasks[0]?.complete).toBe(false);

    });


    it('Отмена изменения  статуса задачи (redo)', () => {
        const task = createTask();
        task.complete = true;

        note.tasks.push(task);

        history.record({
            type: 'change-task-complete',
            taskId: task.id,
            before: false,
            after: true,
        });

        history.undo();
        history.redo();

        expect(note.tasks[0]?.complete).toBe(true);

    });


    it('Изменение текста задачи (undo)', () => {
        const task = createTask();
        note.tasks.push(task);

        task.name = 'Новое название';

        history.record({
            type: 'change-task-name',
            taskId: task.id,
            before: 'Старое название',
            after: 'Новое название',
        });

        history.undo();

        expect(note.tasks[0]?.name).toBe('Старое название');

    });


    it('Отмена изменения названия задачи (redo)', () => {
        const task = createTask();


        task.complete = true;

        note.tasks.push(task);

        history.record({
            type: 'change-task-name',
            taskId: task.id,
            before: 'Старое название',
            after: 'Новое название',
        });

        history.undo();
        history.redo();

        expect(note.tasks[0]?.name).toBe('Новое название')

    });

    it('Отмена добавления задачи (undo)', () => {
        const task = createTask();

        note.tasks.push(task);

        history.record({
            type: 'add-task',
            task,
            index: 0,
        });

        history.undo();

        expect(note.tasks).toHaveLength(0);
    })

    it('Возвращает задачу (redo)', () => {
        const task = createTask();

        note.tasks.push(task);

        history.record({
            type: 'add-task',
            task,
            index: 0,
        });

        history.undo();
        history.redo();

        expect(note.tasks).toHaveLength(1);
        expect(note.tasks[0]).toEqual(task);
    });

    it('Отмена удаления задачи (undo)', () => {
        const task = createTask()

        note.tasks.push(task);
        note.tasks.splice(0, 1);

        history.record({
            type: 'remove-task',
            task,
            index: 0,
        });

        history.undo();

        expect(note.tasks).toHaveLength(1);
        expect(note.tasks[0]).toEqual(task);
    })

    it('Возврат задачи (redo)', () => {
        const task = createTask();

        note.tasks.push(task);
        note.tasks.splice(0, 1);

        history.record({
            type: 'remove-task',
            task,
            index: 0,
        });

        history.undo();
        history.redo();

        expect(note.tasks).toHaveLength(0);
    });

    it('Хранится не больше 50 операций', () => {
        for (let index = 1; index <= 52; index += 1) {
            const before = note.name
            const after = `Название ${index}`

            note.name = after

            history.record({
                type: 'change-name',
                before,
                after,
            })
        }

        for (let index = 0; index < 50; index += 1) {
            history.undo();
        }

        expect(note.name).toBe('Название 2');
        expect(history.canUndo.value).toBe(false);
    })

    it('Очищается история', () => {
        note.name = 'Новое название';

        history.record({
            type: 'change-name',
            before: 'Старое название',
            after: 'Новое название',
        });

        history.clearHistory();

        expect(history.canUndo.value).toBe(false);
        expect(history.canRedo.value).toBe(false);
    });
});