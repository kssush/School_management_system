import React, { useEffect, useState } from "react";
import st from "./Input.module.scss";

const Input = ({placeholder, callback, type = 'text', error}) => {
    const [inputValue, setInputValue] = useState('');

    const name = placeholder.toLowerCase();

    const handleInput = (event) => {
        const vl = event.target.value;
        setInputValue(vl);
        callback(name, vl);
    }

    const hasError = error && error;
    
    return (
        <div className={`${st.container} ${hasError ? st.active : ''}`}>
            <p className={st.error}>{error}</p>
            <input 
                type={type}
                name={placeholder}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInput}
                className={st.input}
            />
            <p className={st.description}>{name}</p>
            
        </div>
    )
};

export default Input;
