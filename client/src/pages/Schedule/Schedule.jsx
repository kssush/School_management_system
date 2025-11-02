import React, { useEffect, useState } from "react";
import st from "./Schedule.module.scss";
import { useMain } from "../../context/mainContext";
import SelectName from "../../components/UI/SelectName/SelectName";
import Button from "../../components/UI/Button/Button";
import CloudIcon from '../../assets/icons/cloud.svg'
import ClockIcon from '../../assets/icons/clock.svg'
import TextButton from "../../components/UI/TextButton/TextButton";
import TableSchedule from "../../components/TableSchedule/TableSchedule";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { useGetLessonQuery, useGetShiftQuery } from "../../store/api/scheduleApi";

const Schedule = () => {
    const [classes, setCalsses] = useState(null);
    const [shift, setShift] = useState({check: false, value: 1});
    const [buttons, setButtons] = useState({});

    const {setHeader, setDescription} = useMain();
 
    const { data } = useGetCombinationQuery();

    const { data: shiftData } = useGetShiftQuery(classes?.id, {
        skip: !classes
    });

     const { data: lessonData, refetch: refetchLessons } = useGetLessonQuery(classes?.id, {
        skip: !classes?.id
    });

    useEffect(() => {
        if(classes) {
            setShift({check: false, value: 1});
            console.log(classes)
        }
    }, [classes])

    useEffect(() => {
        if(shiftData && shiftData != 0){
            setShift({
                check: true,
                value: shiftData
            })
        }
        console.log(shiftData)
    }, [shiftData])

    useEffect(() =>{
        setHeader('Weekly schedule');
        setDescription('All lessons in one place');
    }, [])


    const handleButtonClick = (type, isActive = false) => {
        setButtons(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    }

    const switchShift = () => {
        setShift(prev => ({
            check: prev.check,
            value: prev.value == 1 ? 2 : 1
        }))
    }

    console.log('shift', shift)

    return(
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={data} callback={setCalsses} />
                <TextButton name={'Shift'}>
                    <Button data={shift.value} callback={!shift.check ? switchShift : undefined} />
                </TextButton>
                <Button data={ClockIcon} active={buttons.time} callback={()=> handleButtonClick('time')} />
                <Button data={CloudIcon} onClick={()=> handleButtonClick('cloud')} />
            </div>
            <TableSchedule shift={shift.value} lessonData={lessonData}/>
        </>
    )   
};

export default Schedule;
