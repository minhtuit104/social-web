import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
    userAvatar: string | null;
    updateUserAvatar: (newAvatar: string) => void;
}

const UserContext = createContext<UserContextType>({
    userAvatar: null,
    updateUserAvatar: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

    const updateUserAvatar = (newAvatar: string) => {
        setUserAvatar(newAvatar);
    };

    return (
        <UserContext.Provider value={{ userAvatar, updateUserAvatar }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);