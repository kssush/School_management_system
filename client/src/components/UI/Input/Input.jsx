import React from "react";
import st from "./Input.module.scss";

const Input = ({placeholder}) => {
    return (
        <div className={st.container}>
            <input 
                type="text"
                placeholder={placeholder}
                className={st.input}
            />
            <p className={st.description}>{placeholder.toLowerCase()}</p>
        </div>
    )
};

export default Input;
