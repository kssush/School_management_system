import React, { useState } from "react";

const useErrorHandler = () => {
    const [errors, setErrors] = useState({});

    const handlerError = (error, field = null) => {
        console.error('Error', error);

        if(field){
            setErrors(prev => ({
                ...prev,
                [field]: error.message || 'Invelid value'
            }))
        }else{
            const message = error.data?.message || error.message || 'Something went wrong'
            alert(message)
        }
    }

    const clearError = (field) => {
        setErrors(prev => {
            const { [field]: deleted, ...rest } = prev;
            return rest;
        })
    }

    const clearAllErrors = () => {
        setErrors({})
    }

    return {
        errors,
        handlerError,
        clearError,
        clearAllErrors
    }

};

export default useErrorHandler;