import React, {useState } from "react";
import st from "./Select.module.scss";
import SelectIcon from '../../../assets/icons/select.svg'
import { useClickOutside } from "../../../hooks/useClcikOutside";

const Select = ({data = [], placeholder, callback}) => {
    const [currentValue, setCurrentValue] = useState(placeholder || 'Select..')
    const [isOpen, setIsOpen] = useState(false)

    const selectRef = useClickOutside(() => setIsOpen(false));

    const handleClick = (element) => {
        setCurrentValue(element.name);
        console.log(element.name)
        callback(placeholder.toLowerCase(), element)
    }

    return (
        <div className={`${st.select} ${isOpen ? st.active : ''}`} onClick={() => setIsOpen(!isOpen)} ref={selectRef}>
            <p>{currentValue}</p>
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
}

export default Select;
