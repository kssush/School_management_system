import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import st from "./Modal.module.scss";
import { useClickOutside } from "../../../hooks/useClcikOutside";
import { motion, AnimatePresence } from "framer-motion";
import ButtonCustom from "../ButtonCustom/ButtonCustom";
import CloseIcon from '../../../assets/icons/close.svg'

const animation = {
    start: { opacity: 0 },
    end: { opacity: 1 },
};

const Modal = ({children, active, callback, onClose, onConfirm, textHeader, textClose, textConfirm}) => {
    const [isOpen, setIsOpen] = useState(active);
    const modalRef = useClickOutside(() => handleClose())


    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'

        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);



    const handleClose = () => {
        setIsOpen(false);
    }

    const handleConfirm = () => {
        onConfirm?.(); 
    }

    const handleDelete = () => {
        onClose?.(); 
    }

    if(!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className={st.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={st.modal} 
                ref={modalRef}
            >   
                <img className={st.close} src={CloseIcon} alt="x" onClick={() => handleClose(false)}/>
                <p className={st.header}>{textHeader}</p>
                {children}
                <div className={st.buttons}>
                    <ButtonCustom text={textConfirm} click={handleConfirm} status={'confirm'} />
                    <ButtonCustom text={textClose} click={handleDelete} status={'close'} />
                </div>
            </div>
        </div>,
        document.body
    )
};

export default Modal;