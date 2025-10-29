import React, { useRef } from "react";
import st from "./Search.module.scss";
import SearchIcon from "../../../assets/icons/search.svg";
import CloseIcon from "../../../assets/icons/close.svg";

const Search = ({ value, onChange }) => {
    const inputRef = useRef();
    
    const handleFocus = () => {
        inputRef.current?.focus();
    }

    const handleClear = () => {
        onChange('');
    }
    
    return (
        <div className={`${st.search}`} onClick={(e) => handleFocus(e.target)}>
            <img className={st.iconSearch} src={SearchIcon} alt="sr" />
            <input
                id="search"
                ref={inputRef}
                type="text"
                onChange={(e) => onChange(e.target.value)}
                value={value}
                placeholder="Search..."
            />
            {value && <img className={st.iconClose} src={CloseIcon} alt="x" onClick={handleClear}/>}
        </div>
    );
};

export default Search;
