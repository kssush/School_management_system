import { createContext, useContext, useState } from "react";


const ScheduleContext = createContext();

export const ScheduleProvider = ({children}) => {
    const [addFunc, setAddFunc] = useState(null);
    const [deleteFunc, setDeleteFunc] = useState(null);
    const [isCombination, setIsCombination] = useState(false);
    
    const value = {
        addFunc,
        deleteFunc,
        isCombination,

        setAddFunc,
        setDeleteFunc,
        setIsCombination
    }

    return(
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    )
}

export const useSchedule = () => {
    const context = useContext(ScheduleContext);

    if(!context){
        throw new Error('ошибка')
    }
    return context;
}