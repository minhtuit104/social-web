import React, { createContext, useState, useContext } from 'react';

interface EmotionContextType {
  reactions: { [key: string]: string };
  setReactions: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reactions, setReactions] = useState<{ [key: string]: string }>({});

  return (
    <EmotionContext.Provider value={{ reactions, setReactions }}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};