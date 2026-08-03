
import type { Note } from '#shared/types/note'
import { useNoteStorage } from '~/composables/useNoteStorage'

interface syncOptions {
    onChange: (notes: Note[]) => void
}


export const useNotesSync = ({ onChange }: syncOptions) => {
    const { loadNotes } = useNoteStorage();

    const handleChange = (event: StorageEvent): void => {
        if (event.storageArea !== localStorage) return;

        const storageData = loadNotes();

        onChange(storageData.notes)

    }

    onMounted(() => {
        window.addEventListener('storage', handleChange);
    });

    onUnmounted(() => {
        window.removeEventListener('storage', handleChange);
    })
}