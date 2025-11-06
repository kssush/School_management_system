import React from "react";
import st from "./CardAdd.module.scss";
import AddIcon from '../../assets/icons/add.svg'

const CardAdd = ({click}) => {
    return (
        <div className={st.cardAdd} onClick={click}>
            <div className={st.card}>
                <div className={st.text}>
                    <p>Add a teacher</p>
                    <p>a new employee</p>
                </div>
                <img src={AddIcon} alt="+" />
            </div>
        </div>
    )
};

export default CardAdd;
