import React, { createContext, useContext, useEffect, ReactNode, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Context để quản lý kết nối WebSocket
const WebSocketContext = createContext<Socket | null>(null);

interface WebSocketProviderProps {
  children: ReactNode; // Định nghĩa kiểu cho prop children
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);


  // const socket = useMemo(() => {
  //   const token = localStorage.getItem('token');
  //   if(token){
  //   const newSocket = io('http://localhost:3000', {
  //       auth: { token: token }, 
  //       reconnection: true,
  //       reconnectionAttempts: 5,
  //       reconnectionDelay: 1000,
  //     });
  //     return newSocket;
  //   }
  //   return null;
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000', {
        auth: { token: token }, 
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

    setSocket(newSocket);
    // Lắng nghe sự kiện kết nối thành công
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    // Lắng nghe sự kiện mất kết nối
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
        
    // Cleanup khi component bị unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children} {/* Render children */}
    </WebSocketContext.Provider>
  );
};

// Hook để sử dụng WebSocket trong các component con
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
