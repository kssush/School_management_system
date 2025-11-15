import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [skip, setSkip] = useState(false);
    console.log(user)
    const value = {
        user,
        id: user?.id,
        role: user?.role,
        skip,
        
        setUser,
        setSkip
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    
    if(!context){
        throw new Error('useUser must be used within UserContext')     
    }
    return context;
}