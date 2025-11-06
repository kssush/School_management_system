import { createContext, useContext, useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const HeaderContext = createContext();

export const HeaderProvider = ({children}) => {
    const [isSearchVisible , setSearchVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    const hideSearch = () => setSearchVisible(false);
    const showSearch = () => setSearchVisible(true);

    const debouncedSearchQuery = useDebounce(searchValue);
    
    const value = {
        isSearchVisible,
        searchValue,
        debouncedSearchQuery,

        hideSearch,
        showSearch,
        setSearchValue
    }

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    )
}

export const useHeader = () => {
    const context = useContext(HeaderContext);

    if(!context){
       throw new Error('useHeaderContext must be used within HeaderProvider')     
    }
    return context;
}