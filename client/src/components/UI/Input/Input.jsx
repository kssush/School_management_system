import React, { useState } from "react";
import st from "./Input.module.scss";

const Input = ({placeholder, callback, type = 'text'}) => {
    const [inputValue, setInputValue] = useState('');

    const name = placeholder.toLowerCase();

    const handleInput = (event) => {
        const vl = event.target.value;
        setInputValue(vl);
        callback(name, vl);
    }

    return (
        <div className={st.container}>
            <input 
                type={type}
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
