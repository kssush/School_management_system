import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import st from "./SelectName.module.scss";
import SelectIcon from "../../../assets/icons/select.svg";
import { useClickOutside } from "../../../hooks/useClcikOutside";

const animation = {
    start: { opacity: 0 },
    end: { opacity: 1 },
};

const SelectName = ({ name, data, callback }) => {
    const [value, setValue] = useState("...");
    const [isOpen, setIsOpen] = useState(false);

    const selectRef = useClickOutside(() => setIsOpen(false));

    const handleClick = (element) => {
        setValue(element.name);
        callback(element);
    };

    return (
        <div className={`${st.select} ${isOpen ? st.active : ""}`} ref={selectRef} onClick={() => setIsOpen(!isOpen)}>
            <p>{name}</p>
            <div className={st.value} style={name == "subject" ? { minWidth: "10rem" } : {}}>{value}</div>
            <img src={SelectIcon} alt="∨" />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={animation.start}
                        animate={animation.end}
                        exit={animation.start}
                        transition={{ duration: 0.5 }}
                        className={st.selectItems}
                    >
                        {data ? (
                            data.map((el, index) => <p key={index} onClick={() => handleClick(el)}>{el.name}</p>)
                        ) : (
                            <>Нету элементов</>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SelectName;
