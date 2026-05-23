import './App.css';

import { lazy, Suspense, useEffect, useState } from 'react';
import { signal } from '@preact/signals-react';
import { useSignals } from "@preact/signals-react/runtime";

import { fetchNotes, type NoteResponse } from './api/api';

import Spinner from './components/Spinner/Spinner';
import TitleBar from './components/TitleBar/TitleBar'
import { resumeSession } from './components/common/utils';
import { loadLocalNotes } from './api/local';

const EventList = lazy( () => import('./components/NoteList/NoteList'));
const DetailCard = lazy(() => import('./components/DetailCard/DetailCard'));
const LoginDialog = lazy(() => import('./components/Login/Login'));
const NoteEditor = lazy(() => import('./components/NoteCreation/NoteEditor'));
const UserForm = lazy( () => import('./components/UserForm/UserForm'));
const Popup = lazy(() => import('./components/Popup/Popup'));


const showLogin = signal( false );
const show = signal({noteID: "none", view: ""});
const user = signal({username: "", loggedIn: false, role: ""});
const requestedUpdate = signal(true);

const loadingEvents = signal(false);


function App() {
    useSignals();

    const [errorVisible, setErrorVisible] = useState(false);
    const [serverError, setServerError] = useState("");
    const [events, setEvents] = useState(new Array<NoteResponse>());

    const updateNotesHandler = updateNotes(setEvents);

    useEffect(() => {
        updateNotesHandler();
    }, [requestedUpdate.value]);

    useEffect(() => {
        resumeSession(setServerError, setErrorVisible, user, showLogin);
    }, []);

    return (
        <>
            <div className='view'>
                <TitleBar title='Note Light' showLogin={showLogin} user={user} show={show}/>
                <Suspense fallback={<Spinner />}>
                    <EventList show={show} items={events} update={ updateNotesHandler } />
                </Suspense>
                <Suspense fallback={<Spinner />}>
                    {(show.value.noteID != "none" && show.value.view == "" ) &&
                        <DetailCard show={show} user={user} requestedUpdate={requestedUpdate} />}
                    {show.value.view == "editor" &&
                        <NoteEditor show={show} user={user} update={ updateNotesHandler } />}
                </Suspense>
                <Suspense fallback={<Spinner />}>
                    {["account", "inspect"].includes(show.value.view) &&
                        <UserForm user={user} show={show} />}
                </Suspense>
            </div>
            <Suspense>
                { showLogin &&
                    <LoginDialog showLogin={showLogin} user={user}/> }
                { errorVisible &&
                    <Popup show={errorVisible} onHide={() => setErrorVisible(false)} className='error'>
                        {serverError}
                    </Popup>
                }
            </Suspense>
        </>
    )
}

export default App


function updateNotes(setEvents: React.Dispatch<React.SetStateAction<NoteResponse[]>>): () => Promise<void> {
    return async () => {
        if (loadingEvents.value == true) {
            return;
        }
        if (user.value.loggedIn == false) {
            try {
                const localEvent = loadLocalNotes();
                setEvents(localEvent);
            } catch {
                setEvents([]);
            }
            loadingEvents.value = false;
            return;
        }
        loadingEvents.value = true;
        try {
            await fetchNotes()
                .then(value => {
                    if (value != null) {
                        setEvents(value);
                    }
                });
        } catch (error: any) {
            console.warn(error.message);
        }
        loadingEvents.value = false;
    };
}
