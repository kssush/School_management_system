import React, { useState } from "react";
import useErrorHandler from "./useErrorHandler";

const useFormCreate = () => {
    const [input, setInput] = useState({});
    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const handleInput = (field, value) => {
        clearError(field);
        setInput(prev => ({ ...prev, [field]: value }));
        
        validateField(field, value);
    };

    const validateField = (field, value) => {
        const validations = {
            name: () => value.length < 2 && handlerError(new Error('Name too short'), 'name') || value.length > 14 && handlerError(new Error('Name too long'), 'name'),
            surname: () => value.length < 2 && handlerError(new Error('Surname too short'), 'surname') || value.length > 14 && handlerError(new Error('Surname too long'), 'name'),
            patronymic: () => value.length > 14 && handlerError(new Error('Patronymic too long'), 'patronymic'),
            email: () => !/\S+@\S+\.\S+/.test(value) && handlerError(new Error('Invalid email. Mask ...@pochta.com'), 'email'),
            telephone: () => !/^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(value) && handlerError(new Error('Invalid phone. \nMask: +375 (xx) xxx-xx-xx'), 'telephone'),
        };
        
        validations[field]?.();
    };

    const clearInput = () => setInput({})
    
    return { input, errors, handlerError, handleInput, clearAllErrors, clearInput };
};

export default useFormCreate;
