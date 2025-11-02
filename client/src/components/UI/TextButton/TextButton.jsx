import React from "react";
import st from "./TextButton.module.scss";

const TextButton = ({ name, children }) => {
    return (
        <div className={st.container}>
            <p>{name}</p>
            {children}
        </div>
    )
};

export default TextButton;
