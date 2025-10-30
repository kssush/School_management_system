import React, { useEffect, useRef } from 'react';

export const useClickOutside = (callback) => {
    const ref = useRef();

    useEffect(() => {
        function handleClick(event){
            if(ref.current && !ref.current.contains(event.target)){
                callback();
            }
        }

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback])

    return ref;
};