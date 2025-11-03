import React, { useState } from "react";
import st from "./Button.module.scss";

const Button = ({data, active = false, callback}) => {  
    const isImage = isImageData(data);

    return (
        <button className={`${st.button} ${active && st.active}`} onClick={callback} disabled={!callback}>
            {!isImage ? (
                data
            ) : (
                <img src={data} alt="ic"/>
            )}
        </button>
    );
};

export default Button;

const isImageData = (data) => {
    return data?.toString().includes('.svg' || '.png' || '.jpg');
}
