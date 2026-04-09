import './DetailCard.css';

import { useState, useEffect } from "react";
import { signal, Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

import { deleteNote, type NoteResponse } from "../../api/api";
import { posixToDateAndTime } from '../../utils/utils';
import { loadDetails } from '../common/utils';
import { useTranslation } from '../../context/TranslationContext';

import Frame from "../common/Frame/Frame";
import ConfirmDialog from '../common/ConfirmDialog/ConfirmDialog';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import { deleteLocalNote, loadLocalNote } from '../../api/local';



const loadingNotes = signal(false);

interface Props {
    show: Signal<{noteID: string, view: string}>;
    user: Signal<{username: string, loggedIn: boolean, role: string}>;
    requestedUpdate: Signal<boolean>;
}

function DetailCard( {show, user, requestedUpdate}: Props ) {
    useSignals();
    const { t } = useTranslation();
    const [noteDetails, setNoteDetails]           = useState({} as NoteResponse)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleClose = () => show.value={noteID: "none", view: show.value.view};
    const requestUpdate = ()  => requestedUpdate.value = !requestedUpdate.value; // Request update of slot information

    const loadDetailsHandler = loadDetails(show, loadingNotes, setNoteDetails);

    const handleDeleteEvent = () => {
        if (show.value.noteID) {
            try {
                deleteNote(show.value.noteID)
                    .then( () => {
                        handleClose();
                        requestUpdate();
                    });
            } catch (error: any) {
                console.warn(error.message);
            }
        } else {
            deleteLocalNote();
            requestUpdate();
        }
    }

    useEffect(() => {
        if (user.value.loggedIn) {
            loadDetailsHandler();
        } else {
            setNoteDetails(loadLocalNote());
        }
    }, [show.value.noteID, requestedUpdate.value]);

    return (
        <Frame
            className={ "details" }
            hidden={ show.value.noteID === "none" || show.value.view in ["editor", "inspect"]}
        >
            <div className={"header-container"}>
                <h3>{ `${noteDetails.Title}` }</h3>
                <button onClick={ handleClose }>{t("common.close")}</button>
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
            </div>
            <div id="detail-description">
                <MarkdownRenderer content={noteDetails.Note} />
            </div>
            <hr />
            <div className="buttons">
                <button onClick={ () => show.value={
                        noteID: show.value.noteID
                        ? show.value.noteID
                        : "local", view: "editor"
                }}>
                    {t("common.edit")}
                </button>
                <button onClick={ () => setShowDeleteDialog(true) } className="red-button" >
                    {t("common.delete")}
                </button>
            </div>

            <ConfirmDialog
                    hidden={!showDeleteDialog}
                    className='error'
                    confirmBtnName={t("common.delete")}
                    confirmBtnClass='red-button'
                    onConfirm={ handleDeleteEvent }
                    onCancel={ ()=>setShowDeleteDialog(false) }
                >
                    <div>
                        <h2 className='dialog-text'>{t("warning.deleting event")}: <i>"{noteDetails.Title}"</i></h2>
                        {show.value.noteID}
                        <p className='dialog-text'>{t("warning.are you sure")}</p>
                        <p className='dialog-text'><b>{t("warning.no-takebacks")}</b></p>
                    </div>
                </ConfirmDialog>

        </Frame>
    )
}

export default DetailCard;

