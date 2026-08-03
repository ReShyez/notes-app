import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import { createPinia, setActivePinia,} from 'pinia';

import type { Note, NotesStorageSchema,} from '#shared/types/note';
import {STORAGE_KEYS, STORAGE_SCHEMA_VERSION,} from '#shared/constants/storage';
import { useNotesStore } from '~/store/note/store';

const createMockStorage = () => {
    let storage: Record<string, string> = {}

    return {
        getItem: vi.fn((key: string): string | null => {
            return storage[key] ?? null
        }),

        setItem: vi.fn((key: string, value: string): void => {
            storage[key] = String(value)
        }),

        removeItem: vi.fn((key: string): void => {
            delete storage[key]
        }),

        clear: vi.fn((): void => {
            storage = {}
        }),

        key: vi.fn((index: number): string | null => {
            return Object.keys(storage)[index] ?? null
        }),

        get length(): number {
            return Object.keys(storage).length
        },
    }
}

const CURRENT_DATE = '1999-01-01T00:01:00.000Z'

let localStorageMock: ReturnType<typeof createMockStorage>

beforeEach(() => {
    setActivePinia(createPinia());

    localStorageMock = createMockStorage();

    vi.stubGlobal(
        'localStorage',
        localStorageMock,
    );

    vi.useFakeTimers();
    vi.setSystemTime(new Date(CURRENT_DATE));
})

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});


const createNote = (overrides: Partial<Note> = {},): Note => ({
    id: 'note-1',
    name: 'Тестовая заметка',
    tasks: [],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    ...overrides,
});

const secondNote = createNote({
    id: 'note-2',
    name: 'Вторая заметка',
})

describe('useNotesStore', () => {
    it('Загружаются заметы из localStorage и инициализируется', () => {
        const note = createNote();

        const storageData: NotesStorageSchema = {
            version: STORAGE_SCHEMA_VERSION,
            notes: [note],
        };

        localStorage.setItem(
            STORAGE_KEYS.notes,
            JSON.stringify(storageData),
        );

        const store = useNotesStore();

        store.initialize();

        expect(store.notes).toEqual([note]);
        expect(store.initialized).toBe(true);
    });

    it('Нет повторной инициализации', () => {
        const firstNote = createNote({
            id: 'note-1',
            name: 'Первая заметка',
        });

        const secondNote = createNote({
            id: 'note-2',
            name: 'Вторая заметка',
        });

        localStorage.setItem(
            STORAGE_KEYS.notes,
            JSON.stringify({
                version: STORAGE_SCHEMA_VERSION,
                notes: [firstNote],
            }),
        );

        const store = useNotesStore();

        store.initialize();

        localStorage.setItem(
            STORAGE_KEYS.notes,
            JSON.stringify({
                version: STORAGE_SCHEMA_VERSION,
                notes: [secondNote],
            }),
        );

        store.initialize();

        expect(store.notes).toEqual([firstNote]);
    });

    it('Создается пустая заметка', () => {
        const store = useNotesStore()

        const note = store.createNote()

        expect(note).toMatchObject({
            name: '',
            tasks: [],
            createdAt: CURRENT_DATE,
            updatedAt: CURRENT_DATE,
        })

        expect(note.id).toEqual(expect.any(String));
        expect(store.notes).toEqual([]);
    });

    it('Создается пустая задача', () => {
        const store = useNotesStore();

        const task = store.createTask();

        expect(task).toMatchObject({
            name: '',
            complete: false,
        });

        expect(task.id).toEqual(expect.any(String));
    });

    it('Новая заметка сохраняется в сторе', () => {
        const store = useNotesStore();
        const note = createNote();

        store.saveNote(note);

        expect(store.notes).toHaveLength(1);

        expect(store.notes[0]).toMatchObject({
            id: note.id,
            name: note.name,
            updatedAt: CURRENT_DATE,
        });
    });

    it('Обновление заметки', () => {
        const store = useNotesStore();

        const note = createNote({
            name: 'Старое название',
        });

        store.notes = [note];

        store.saveNote({
            ...note,
            name: 'Новое название',
        });

        expect(store.notes).toHaveLength(1)
        expect(store.notes[0]?.name).toBe('Новое название',);
        expect(store.notes[0]?.updatedAt).toBe(
            CURRENT_DATE,
        );
    });

    it('Удалеение заметки', () => {
        const firstNote = createNote({ id: 'note-1' });

        const secondNote = createNote({ id: 'note-2' });

        const store = useNotesStore();

        store.notes = [ firstNote, secondNote ];

        const result = store.deleteNote(firstNote.id);

        expect(result).toBe(true);
        expect(store.notes).toEqual([ secondNote ]);
    });

    it('Замена заметок', () => {
        const oldNote = createNote({ id: 'old-note' });

        const newNote = createNote({ id: 'new-note' });

        const store = useNotesStore();

        store.notes = [oldNote];

        store.replaceNotes([newNote]);

        expect(store.notes).toEqual([newNote]);
    });
});