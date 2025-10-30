import { createContext, useContext, useState } from "react";


const MainContext = createContext();

export const MainProvider = ({children}) => {   
    const [header, setHeader] = useState('Header');
    const [description, setDescription] = useState('Description');

    const value = {
        header,
        description,

        setHeader,
        setDescription
    }

    return(
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
} 

export const useMain = () => {
    const context = useContext(MainContext);

    if(!context){
        throw new Error('No with MainProvider!')
    }
    return context;
}