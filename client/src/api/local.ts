import { setLocalStorage, getLocalStorage, clearLocalStorage } from "../utils/local_storage";
import { base64, decode64, posixNow } from "../utils/utils";
import type { NoteResponse } from "./api";

export function saveLocalNote(text: string, createdDt: number) {
    setLocalStorage("local-note", `${createdDt};${posixNow()};${base64(text)}`);
}

export function loadLocalNote(): NoteResponse {
    const rawNote = getLocalStorage("local-note");
    if (!rawNote) {
        throw new Error("No local note");
        ;
    }

    const noteData = rawNote.split(";", 3);
    const created = Number(noteData[0]);
    const modified = Number(noteData[1]);
    const text = decode64(noteData[2]);

    return {
        ID:                 created,
        Title:              text.split(" ", 1)[0],
        Note:               text,
        DtCreated:          created,
        DtModified:         modified
    } as NoteResponse;
}

export function deleteLocalNote() {
    clearLocalStorage("local-note");
}
