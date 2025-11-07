import React from "react";
import st from "./CardAdd.module.scss";
import AddIcon from '../../assets/icons/add.svg'

const CardAdd = ({text, click}) => {
    return (
        <div className={st.cardAdd} onClick={click}>
            <div className={st.card}>
                <div className={st.text}>
                    <p>{text?.up}</p>
                    <p>{text?.down}</p>
                </div>
                <img src={AddIcon} alt="+" />
            </div>
        </div>
    )
};

export default CardAdd;
