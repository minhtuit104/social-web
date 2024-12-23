import React, { createContext, useContext, useEffect, useState } from 'react';

interface ChatContextType {
    openChats: Array<{
        userId: number;
        name: string;
        avarta: string;
    }>;
    openChat: (userData: any) => void;
    messages: Record<number, Array<any>>;
    closeChat: (userId: number) => void;
    addMessage: (userId: number, message: any) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, socket }: { children: React.ReactNode, socket: any }) => {
    const [openChats, setOpenChats] = useState<Array<{
        userId: number;
        name: string;
        avarta: string;
    }>>([]);

    const [messages, setMessages] = useState<Record<number, Array<any>>>({});

    // Xử lý tin nhắn mới
    useEffect(() => {
        if (!socket?.connected) {
            return;
        }

        const handleNewMessage = (message: any) => {
            console.log("Received new message:", message);
            const senderId = message.sender.idUser;

            //luon thêm tin nhắn vào state, bất kể chat đã được mở hay chưa
            addMessage(senderId, message);
            
            // Tự động mở chat khi nhận tin nhắn mới
            setOpenChats(prev => {
                const existingChat = prev.find(chat => chat.userId === senderId);
                if (existingChat) return prev;

                return [...prev, {
                    userId: senderId,
                    name: message.sender.name,
                    avarta: message.sender.avarta
                }];
            });

        };

        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [socket?.connected]);

    const openChat = (userData: any) => {
        setOpenChats(prev => {
            const existingChat = prev.find(chat => chat.userId === userData.idUser);
            if (existingChat) return prev;
            
            return [...prev, {
                userId: userData.idUser,
                name: userData.name,
                avarta: userData.avarta
            }];
        });
    };

    const closeChat = (userId: number) => {
        setOpenChats(prev => prev.filter(chat => chat.userId !== userId));
    };

    const addMessage = (userId: number, message: any) => {
        setMessages(prev => ({ 
            ...prev, 
            [userId]: [...(prev[userId] || []), message] 
        }));
    };

    return (
        <ChatContext.Provider value={{ openChats, openChat, closeChat, messages, addMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};