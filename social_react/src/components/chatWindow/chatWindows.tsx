import { useEffect, useState } from "react";
import ChatNotificationModal from "../chatNotificationModal/ChatNotificationModal";
import './chatWindows.css';
import { useChat } from "../UserContext/ChatContext";

interface ChatWindowsProps {
    socket: any;
}

const ChatWindows = ({socket}: ChatWindowsProps) => {
    const { openChats, closeChat } = useChat();

    // //lắng nghe sự kiện openChat từ contacts
    // useEffect(() => {
    //     if(!socket?.connected){
    //         console.log("ChatWindows: Socket not connected");
    //         return;
    //     };
        
    //     //lắng nghe tin nhắn mới để tự động mở chat
    //     const handleNewMessage = (message: any) => {
    //         const senderId = message.sender.idUser;
    //         setOpenChats((prev: any) => {
    //             const existingChat = prev.find((chat: any) => chat.userId === senderId);
    //             if (existingChat) return prev;

    //             return [...prev, {
    //                 userId: senderId,
    //                 name: message.sender.name,
    //                 avarta: message.sender.avarta
    //             }];
    //         });
    //     };


    //     try {
    //         socket.on('receiveMessage', handleNewMessage);
    //     } catch (error) {
    //         console.error("Error setting up socket listeners:", error);
    //     }
    //     return () => {
    //         socket.off('receiveMessage', handleNewMessage);
    //     };
    // }, [socket?.connected]);


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