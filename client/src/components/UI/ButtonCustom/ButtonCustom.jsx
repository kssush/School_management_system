import React from "react";
import st from "./ButtonCustom.module.scss";

const color = {
    confirm: '#EFD4FF',
    close: '#E7D3DE'
}

const ButtonCustom = ({text, click, status}) => {
    return (
        <button className={st.button} style={{'backgroundColor': color[status] || color['confirm']}} onClick={click}>
            {text}
        </button>
    );
};

export default ButtonCustom;
