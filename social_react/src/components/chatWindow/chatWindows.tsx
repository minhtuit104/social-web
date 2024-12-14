import { useEffect, useState } from "react";
import ChatNotificationModal from "../chatNotificationModal/ChatNotificationModal";
import './chatWindows.css';
import { useChat } from "../UserContext/ChatContext";

interface ChatWindowsProps {
    socket: any;
}

const ChatWindows = ({socket}: ChatWindowsProps) => {
    const { openChats, closeChat } = useChat();

    return (<>
        <div className="chat-windows">
            {openChats.map((chat, index) => (
                <ChatNotificationModal 
                    key={chat.userId} 
                    socket={socket} 
                    userId={chat.userId} 
                    position={index}
                    onClose={() => closeChat(chat.userId)}
                />
            ))}
        </div>
    </>);
}

export default ChatWindows;