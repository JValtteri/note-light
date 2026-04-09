import "./NoteCreation.css";

import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal, type Signal } from "@preact/signals-react";

import { posixToDateAndTime, posixNow } from "../../utils/utils";
import type { NoteResponse } from "../../api/api";
import { makeNote, editNote } from "../../api/api";
import { loadDetails } from "../common/utils";
import { useTranslation } from "../../context/TranslationContext";

import Frame from "../common/Frame/Frame";
import Popup from "../Popup/Popup";
import { loadLocalNote, saveLocalNote } from "../../api/local";


const timeslotSignal = signal<Map<number, {"Size": number}>>(new Map());
const loadingEvents = signal(false);

interface Props {
    show: Signal<{noteID: string, view: string}>;
    user: Signal<{username: string, loggedIn: boolean, role: string}>;
    update: ()=>Promise<void>
}

function NoteCreation ({show, user, update}: Props) {
    useSignals();
    const {t} = useTranslation();

    // Input state information
    const [noteTitle, setNoteTitle] = useState("");
    const [createdDt, setCreatedDt] = useState(0);
    const [modifiedDt,   setModifiedDt]   = useState(0);
    const [noteText, setNoteText]   = useState("");

    // State info for editing event
    const [noteID, setnoteID]     = useState(show.value.noteID);
    const [noteDetails, setNoteDetails] = useState({
        Title: "",
        Note: "",
        DtCreated: 0,
        DtModified: 0,
    } as NoteResponse); // Makes sure no field is of undefined type

    // Dialog state information
    const [dialogText, setDialogText] = useState("---nothing---");
    const [confiramtionDialogVisible, setConfirmationDialogVisible] = useState(false);

    // Named input elements
    const dateInput  = document.getElementById("date");
    const startInput = document.getElementById("start-time");
    const endInput   = document.getElementById("end-time");

    const loadDetailsHandler = loadDetails(show, loadingEvents, setNoteDetails);

    useEffect( () => {
        setnoteID(show.value.noteID);
        if (show.value.noteID == "none") {
            clearForm();
        } else if (show.value.noteID == "local") {
            setNoteDetails(loadLocalNote());
        } else {
            loadDetailsHandler();
        }
    }, [show.value.view, show.value.noteID])

    useEffect( () => {
        setnoteID(show.value.noteID);
        if (show.value.noteID != "none") {
            populateForm();
        }
    }, [noteDetails])


    useEffect( () => {
        populateForm();
    }, [show.value.noteID])

    const handleSaveNote = (online: boolean) => {
        try {
            if (noteID == "none") {
                if (online) {
                    try {
                        makeNote(noteTitle, noteText, createdDt, modifiedDt)
                            .then( (value ) => {
                                removeWrongLabelFromInputs(dateInput, startInput, endInput);
                                setDialogText(`Event created.\nEvent ID: ${value.NoteID}\n${value.Error}`);
                                clearForm();
                                hideEditor(show);
                                update();
                        });
                    } catch (error: any) {
                        setDialogText( `${error.message}\n`);
                        console.warn(error.message);
                    }
                } else {
                    saveLocalNote(noteText, posixNow());
                    update();
                }
            } else {
                if (online) {
                    try {
                        editNote(noteID, noteTitle, noteText, createdDt, modifiedDt)
                            .then( (value ) => {
                                removeWrongLabelFromInputs(dateInput, startInput, endInput);
                                setDialogText(`Event created.\nEvent ID: ${value.NoteID}\n${value.Error}`);
                                clearForm();
                                hideEditor(show);
                                update();
                        });
                    } catch (error: any) {
                        setDialogText( `${error.message}\n`);
                        console.warn(error.message);
                    }
                    setConfirmationDialogVisible(true);
                } else {
                    saveLocalNote(noteText, createdDt);
                    update();
                }
            }

        } catch (error) {
            console.error(error);
            console.error(`Failed to create timestamp from: '${createdDt}', '${modifiedDt}'`);
            labelInputsAsWrong(dateInput, startInput, endInput);
        }
    };

    const clearForm = () => {
        setNoteTitle("");
        setNoteText("");
        setCreatedDt(0);
        setModifiedDt(0);
        timeslotSignal.value = new Map()
    };

    const populateForm = () => {
        setNoteTitle(noteDetails.Title);
        setNoteText(noteDetails.Note);
        if (noteID == "none") {
            setCreatedDt(posixNow());
            setModifiedDt(posixNow());
        } else {
            setCreatedDt(noteDetails.DtCreated);
            setModifiedDt(noteDetails.DtModified);
        }
    };

    return (
        <>
            <Frame className="NoteForm" hidden={show.value.view != "editor"}>
                {noteID != "none" && `${t("note.editing")} #${noteID}`}
                <div className="header">
                    <h3>{ `${noteTitle}` }</h3>
                    <div id="close-box">
                        <button id="close" onClick={ () => hideEditor(show) }>{t("common.close")}</button>
                    </div>
                </div>

                <div className="detail-time">
                    <div>
                        Created:
                    </div>
                    <div>
                        { posixToDateAndTime(noteDetails.DtCreated) }
                    </div>
                    <div>
                        Modified:
                    </div>
                    <div>
                        { posixToDateAndTime(noteDetails.DtModified) }
                    </div>
                </div>
                <br></br>
                <label className="form-label" htmlFor="note-text">{t("note.text")}</label>
                <textarea id="event-desctiption" value={noteText} onChange={e => setNoteText(e.target.value)} required></textarea>

                <div className="buttons editor-buttons">
                    <button id="publish" className="selected"  onClick={ () => handleSaveNote(user.value.loggedIn) }>
                        {t("common.save")}
                    </button>
                </div>
            </Frame>
            <Popup show={confiramtionDialogVisible} onHide={() => setConfirmationDialogVisible(false)}>
                {dialogText}
            </Popup>
        </>
    );
}

export default NoteCreation;


const hideEditor = (show: Signal<{noteID: string, view: string}>) => {
    show.value = {"noteID": "none", view: ""};
}

function labelInputsAsWrong(dateInput: HTMLElement | null, startInput: HTMLElement | null, endInput: HTMLElement | null) {
    dateInput?.classList.add("wrong");
    startInput?.classList.add("wrong");
    endInput?.classList.add("wrong");
}

function removeWrongLabelFromInputs(dateInput: HTMLElement | null, startInput: HTMLElement | null, endInput: HTMLElement | null) {
    dateInput?.classList.remove("wrong");
    startInput?.classList.remove("wrong");
    endInput?.classList.remove("wrong");
}
