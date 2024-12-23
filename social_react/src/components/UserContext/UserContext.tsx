import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
    userAvatar: string | null;
    userNewName: string | null;
    userNewEmail: string | null;
    updateUserAvatar: (newAvatar: string) => void;
    updateUserInfo: (name: string, email: string) => void;
}

const UserContext = createContext<UserContextType>({
    userAvatar: null,
    userNewName: null,
    userNewEmail: null,
    updateUserAvatar: () => {},
    updateUserInfo: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userNewName, setUserNewName] = useState<string | null>(null);
    const [userNewEmail, setUserNewEmail] = useState<string | null>(null);

    const updateUserAvatar = (newAvatar: string) => {
        setUserAvatar(newAvatar);
    };

    const updateUserInfo = (name: string, email: string) => {
        setUserNewName(name);
        setUserNewEmail(email);
    };

    return (
        <UserContext.Provider value={{ userAvatar, updateUserAvatar, userNewName, userNewEmail, updateUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);