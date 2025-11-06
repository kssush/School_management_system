import React, { useState } from "react";
import st from "./Button.module.scss";

const Button = ({data, active = false, callback, rotate = false}) => {  
    const isImage = isImageData(data);

    return (
        <button className={`${st.button} ${active && st.active} ${!callback && st.disabled}`} onClick={callback} disabled={!callback}>
            {!isImage ? (
                data
            ) : (
                <img src={data} alt="ic" className={`${rotate && st.rotate}`}/>
            )}
        </button>
    );
};

export default Button;

const isImageData = (data) => {
    return data?.toString().includes('.svg' || '.png' || '.jpg');
}
