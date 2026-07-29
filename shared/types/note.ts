export interface Task {
    id: string;
    name: string;
    complete: boolean;
}

export interface Note {
    id: string;
    name: string;
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface NotesStorageSchema {
    version: number;
    notes: Note[];
}

export interface NoteDraft {
    note: Note;
    noteId: string;
    version: number;
    savedAt: string;

}