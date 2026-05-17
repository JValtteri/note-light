import { setTitle } from "../components/common/utils";
import { setLocalStorage, getLocalStorage, clearLocalStorage } from "../utils/local_storage";
import { base64, decode64, posixNow } from "../utils/utils";
import type { NoteListResponse, NoteResponse } from "./api";

export function saveLocalNote(text: string, createdDt: number) {
    setLocalStorage(`L${createdDt}`, `${createdDt};${posixNow()};${base64(text)}`);
    // Update the index
    const noteIndex = getLocalStorage("note-index");
    setLocalStorage(`note-index`, `${noteIndex};L${createdDt}`);
}

export function editLocalNote(text: string, createdDt: number, id: string) {
    setLocalStorage(id, `${createdDt};${posixNow()};${base64(text)}`);
}

export function loadLocalNotes(): NoteListResponse {
    const rawIndex = getLocalStorage("note-index");
    if (rawIndex == "") return [];
    const indexTimestamps = rawIndex.split(";").filter(id => id.length > 0);
    const localNotes: NoteListResponse = [];
    for (const noteId of indexTimestamps) {
        if (!noteId) continue;
        try {
            const note = loadLocalNote(noteId);
            if (note) localNotes.push(note);
        } catch (error) {
            console.warn(`Failed to load note ${noteId}`, error);
        }
    }
    return localNotes;
}

export function loadLocalNote(id: string): NoteResponse {
    const rawNote = getLocalStorage(`${id}`);
    if (!rawNote) {
        throw new Error(`No local note: ${id}`);
    }

    const noteData = rawNote.split(";", 3);
    const created = Number(noteData[0]);
    const modified = Number(noteData[1]);
    const text = decode64(noteData[2]);

    return {
        ID:                 `L${created}`,
        Title:              setTitle(text),
        Note:               text,
        DtCreated:          created,
        DtModified:         modified
    } as NoteResponse;
}

export function deleteLocalNote(id: string) {
    clearLocalStorage(`${id}`);
    // Update the index
    let rawIndex = getLocalStorage("note-index");
    rawIndex = rawIndex.replace(`;${id}`,"");
    setLocalStorage(`note-index`, rawIndex);
}
