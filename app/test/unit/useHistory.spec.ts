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

    it('Отмена извеменения заметка (undo)', () => {
        note.name = 'Новое название';

        history.record({
            type: 'change-name',
            before: 'Старое название',
            after: 'Новое название',
        });

        history.undo();

        expect(note.name).toBe('Старое название')
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

            expect(note.name).toBe('Новое название')
        }
    )

    it('Изменение статуса задачи (undo)', () => {
        const task = createTask();
        note.tasks.push(task);

        task.complete = true;

        history.record({
            type: 'change-task-complete',
            taskId: task.id,
            before: false,
            after: true,
        });

        history.undo();

        expect(note.tasks[0]?.complete).toBe(false)

    });


    it('Отмена изменение статуса задачи (redo)', () => {
        const task = createTask();
        note.tasks.push(task);

        task.complete = true;

        history.record({
            type: 'change-task-complete',
            taskId: task.id,
            before: false,
            after: true,
        });

        history.undo();
        history.redo();

        expect(note.tasks[0]?.complete).toBe(true)

    });

});