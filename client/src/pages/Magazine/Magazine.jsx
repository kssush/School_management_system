import React, { useEffect } from "react";
import st from "./Magazine.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";

const Magazine = () => {
    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();
    
     useEffect(() =>{
        setHeader('Magazine');
        setDescription('All lessons in one place');
        hideSearch();
    }, [])

    return <div></div>;
};

export default Magazine;
