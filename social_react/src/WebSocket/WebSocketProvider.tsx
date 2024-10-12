import React, { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

// Context để quản lý kết nối WebSocket
const WebSocketContext = createContext<Socket | null>(null);

interface WebSocketProviderProps {
  children: ReactNode; // Định nghĩa kiểu cho prop children
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000', {
        auth: { token: token }, 
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      return newSocket;
  }, []);

  useEffect(() => {
    // Cleanup khi component bị unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

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
