import type { Note, Task } from '#shared/types/note'
import { useNoteStorage } from '~/composables/useNoteStorage'
interface NotesState {
    notes: Note[];
    initialized: boolean;
}

const createId = (): string => crypto.randomUUID();

const cloneNote = (note: Note): Note => {
    return structuredClone(toRaw(note));
}


export const useNotesStore = defineStore('notes', {
    state: (): NotesState => ({
        notes: [],
        initialized: false,
    }),

    getters: {
        getNoteById: (state: NotesState) => {
            return (id: string) : Note | undefined => {
                return state.notes.find((note) => note.id === id);
            }
        },
        getInitialized: (state: NotesState) => {
            return state.initialized;
        }
    },

    actions: {
        initialize(): void {
            if( this.initialized || !import.meta.client) return;

            const storage = useNoteStorage();
            const data = storage.loadNotes();

            this.notes = data.notes;
            this.initialized = true;
        },

        createNote(): Note {
            const now = new Date().toISOString();

            return {
                id: createId(),
                name: '',
                tasks: [],
                createdAt: now,
                updatedAt: now,
            };
        },

        createTask(): Task {
            return {
                id: createId(),
                name: '',
                complete: false,
            };
        },

        saveNote(note: Note) {
            const storage = useNoteStorage();
            const noteToSave = cloneNote(note);
            const thisIndex = this.notes.findIndex(item => item.id === note.id);

            noteToSave.updatedAt = new Date().toISOString();

            if( thisIndex === -1 ) {
                this.notes.push(noteToSave);
            } else {
                this.notes[thisIndex] = noteToSave;
            }

            storage.saveNotes(this.notes)
            storage.removeDraft(note.id)
        },

        deleteNote(noteId: string): boolean {
            const storage = useNoteStorage();
            const thisIndex = this.notes.findIndex(item => item.id === noteId);

            if (thisIndex === -1) {
                return false
            }

            this.notes.splice(thisIndex, 1);

            storage.saveNotes(this.notes)
            storage.removeDraft(noteId);

            return true;
        },

        replaceNotes(notes: Note[]): void {
            this.notes = notes;
        }
    }
})