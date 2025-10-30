import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import st from "./SearchName.module.scss";
import SelectIcon from "../../../assets/icons/select.svg";
import { useClickOutside } from "../../../hooks/useClcikOutside";

const animation = {
    start: { opacity: 0 },
    end: { opacity: 1 },
};

const data = [1,2,3,4,5,6,7,8]

const SearchName = ({ name, callback }) => {
    const [value, setValue] = useState("...");
    const [isOpen, setIsOpen] = useState(false);

    const selectRef = useClickOutside(() => setIsOpen(false));

    const handle = (event) => {
        if (event.target.tagName == "P") {
            const targetValue = event.target.textContent;

            setValue(targetValue);
            callback(targetValue);
        }
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
                        onClick={handle}
                    >
                        {data ? (
                            data.map((el, index) => <p key={index}>{el}</p>)
                        ) : (
                            <>Нету элементов</>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchName;
