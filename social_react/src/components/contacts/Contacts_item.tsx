import React from "react";
import "./contacts_item.css";

interface ContactsItemProps {
    friend: {
        idUser: number;
        name: string;
        avarta: string;
    };
    onClick: () => void;
}

const ContactsItem = ({friend, onClick}: ContactsItemProps) => {

    return (<>
        <div className="contact-item" onClick={onClick}>
            <div className="contact-item-container">
                <img src={friend.avarta ?? 'https://www.gravatar.com/avatar/?d=mp'} alt="" className="img-contact"/>
                <div className="contact-item-badge"></div>
            </div>
            <span>{friend.name}</span>
        </div>
    </>);
}

export default ContactsItem;