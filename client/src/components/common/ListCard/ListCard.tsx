import './ListCard.css';

import Frame from "../Frame/Frame";


interface Props {
    modifiedTime?: string;
    desc?: string;
    title: string;
    onClick: ()=>void;
    selected: boolean;
    className?: string;
}

function ListCard({modifiedTime, desc, title, onClick, selected, className}: Props) {
    const baseClasses = selected ? "card selected" : "card";
    const additionalClasses = className==undefined ? "" : className;
    return(
        <Frame reactive={true} className={`${ baseClasses } ${ additionalClasses }`} onClick={onClick}>
            <div className="primary">{title}</div>
            <div className="secondary right">{`${modifiedTime}`}</div>
            <div className="secondary desc">{desc}</div>
            <div className="secondary right">{`...`}</div>
        </Frame>
    )
}

export default ListCard;
