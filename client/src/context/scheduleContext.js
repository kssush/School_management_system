import { createContext, useContext, useState } from "react";


const ScheduleContext = createContext();

export const ScheduleProvider = ({children}) => {   
    const [isShift, setIsShift] = useState(false);
    const [combination, setCombination] = useState(null);

    const value = {
        isShift,
        combination,

        setIsShift,
        setCombination
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
        throw new Error('useSchedule must be used within ScheduleContext')     
    }
    return context;
}