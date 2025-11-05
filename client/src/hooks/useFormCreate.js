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
            name: () => value.length < 2 && handlerError(new Error('Name too short'), 'name'),
            email: () => !/\S+@\S+\.\S+/.test(value) && handlerError(new Error('Invalid email'), 'email')
        };
        
        validations[field]?.();
    };

    const clearInput = () => setInput({})
    
    return { input, errors, handleInput, clearAllErrors, clearInput };
};

export default useFormCreate;
