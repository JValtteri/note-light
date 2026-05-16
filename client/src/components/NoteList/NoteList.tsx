import './NoteList.css';

import type { ReactNode } from 'react';
import { Signal } from '@preact/signals-react';
import { useSignals } from "@preact/signals-react/runtime";

import Frame from '../common/Frame/Frame';
import ListCard from '../common/ListCard/ListCard';
import AddCard from '../AddCard/AddCard';

import type { NoteResponse } from '../../api/api';
import { posixToDateAndTime } from '../../utils/utils';


interface Props {
    items: NoteResponse[];
    show: Signal<{noteID: string, view: string}>;
    update: ()=>Promise<void>
}

function NoteList({items, show, update}: Props) {
    useSignals();

    items = items.sort( (a, b) => a.DtModified - b.DtModified );
    const children: ReactNode[] = (
        items.map( (item: NoteResponse) => {
            return makeListElement(item, show, update);
        })
    );
    return (
        <Frame reactive={false} className='list-body'>
            {items.length === 0 && <p>no item found</p>}
            {children}
            <AddCard onClick={ () => show.value = showEditor() } />
        </Frame>
    )
}

export default NoteList;


const showEditor = () => ({noteID: "none", view: "editor"});

function makeListElement(
    item: NoteResponse,
    show: Signal<{noteID: string, view: string}>,
    update: ()=>Promise<void>
) {
    try {
        return makeCard(item, show, update);
    } catch {
        return makeCard(item, show, update);
    }
};

const makeCard = (note: NoteResponse, show: Signal, update: ()=>Promise<void> ) => (
    <ListCard
        title={note.Title}
        modifiedTime={posixToDateAndTime(note.DtModified)}
        desc={""}
        key={note.ID}
        onClick={ () => {
            show.value = showIndex(note.ID, show)
            update();
        } }
        selected={ show.value.noteID == note.ID }
        className={ "event-list-card" }
    />
)

const showIndex = (id: string, show: Signal) => (
    {
        noteID: id,
        view: show.value.view == "inspect" ? "inspect" : ""
    });
