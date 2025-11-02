import React, { useState } from "react";
import st from "./Select.module.scss";
import SelectIcon from '../../../assets/icons/select.svg'
import { useClickOutside } from "../../../hooks/useClcikOutside";

const Select = ({placeholder, data = [], callback}) => {
    const [value, setValue] = useState(placeholder || 'Name')
    const [isOpen, setIsOpen] = useState(false)
    
    const selectRef = useClickOutside(() => setIsOpen(false));

    const handleClick = (element) => {
        console.log(element);
        callback(); ////
    }

    return (
        <div className={`${st.select} ${isOpen ? st.active : ''}`} onClick={() => setIsOpen(!isOpen)} ref={selectRef}>
            <p>{value}</p>
            <img src={SelectIcon} alt="∨" />
            <div className={st.selectItems}>
                {data.length != 0 ? (
                    data.map((el, index) => (
                        <p key={index} onClick={() => handleClick(el)}>{el.name}</p>
                    ))
                ) : (
                    <p>There are no elements</p>
                )}
            </div>
        </div>
    )
};

export default Select;
