import React, { useEffect, useState } from "react";
import st from "./Schedule.module.scss";
import { useMain } from "../../context/mainContext";
import SearchName from "../../components/UI/SearchName/SearchName";

const Schedule = () => {
    const [classes, setCalsses] = useState(null);
    const {setHeader, setDescription} = useMain();

    useEffect(() =>{
        setHeader('Weekly schedule');
        setDescription('All lessons in one place');
    }, [])

    return(
        <>
            <SearchName name={'Class'} callback={setCalsses}/>
        </>
    )
};

export default Schedule;
