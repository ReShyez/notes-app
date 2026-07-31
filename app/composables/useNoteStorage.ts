import { STORAGE_SCHEMA_VERSION, STORAGE_KEYS } from '#shared/constants/storage';
import type { Note, NotesStorageSchema, NoteDraft} from '#shared/types/note';

type DraftsStorage = Record<string, NoteDraft>;

const createStorage = () : NotesStorageSchema => ({
    version: STORAGE_SCHEMA_VERSION,
    notes: []
})


//минихелпер, чтобы не писать постоянно обработку
const parseJson = <T>(value: string | null): T | null => {
    if(!value) return null;

    try {
        return JSON.parse(value) as T;
    }
    catch {
        return null;
    }
}

export const useNoteStorage = () => {

    const saveNotes = (notes: Note[]) => {
        if(!import.meta.client) return;

        const data: NotesStorageSchema = {
            version: STORAGE_SCHEMA_VERSION,
            notes
        }

        localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(data));
    }

    const loadNotes = (): NotesStorageSchema => {

        if(!import.meta.client) return createStorage();

        const storageData = parseJson<NotesStorageSchema>(localStorage.getItem(STORAGE_KEYS.notes));

        if(!storageData) return createStorage();

        if(storageData.version !== STORAGE_SCHEMA_VERSION) return createStorage();

        if(!Array.isArray(storageData.notes)) return createStorage();

        return storageData;
    }

    const saveDraft = (noteId: string, note: Note) => {
        if(!import.meta.client) return;

        const drafts = parseJson<DraftsStorage>(localStorage.getItem(STORAGE_KEYS.drafts)) ?? {};

        drafts[noteId] = {
            note,
            noteId,
            version: STORAGE_SCHEMA_VERSION,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts));
    }

    const loadDraft = (noteId: string): NoteDraft | null => {
        if(!import.meta.client) return null;

        const drafts = parseJson<DraftsStorage>(localStorage.getItem(STORAGE_KEYS.drafts)) ?? {};

        const draft = drafts[noteId];

        if(!draft || draft.version !== STORAGE_SCHEMA_VERSION) return null;

        return draft;
    }

    const removeDraft = (noteId: string) => {
        if(!import.meta.client) return;

        const drafts = parseJson<DraftsStorage>(localStorage.getItem(STORAGE_KEYS.drafts)) ?? {};

        delete drafts[noteId];

        localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts));
    }

    return {
        loadNotes,
        saveNotes,
        loadDraft,
        saveDraft,
        removeDraft,
    }
}

export class useNoteStore {
}