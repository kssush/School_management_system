import React, { useEffect, useMemo, useState } from "react";
import st from "./Schedule.module.scss";
import { useMain } from "../../context/mainContext";
import SelectName from "../../components/UI/SelectName/SelectName";
import Button from "../../components/UI/Button/Button";
import CloudIcon from '../../assets/icons/cloud.svg'
import ClockIcon from '../../assets/icons/clock.svg'
import TextButton from "../../components/UI/TextButton/TextButton";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { useAddLessonMutation, useDeleteLessonMutation, useGetLessonQuery, useGetShiftQuery, useGetSubjectQuery } from "../../store/api/scheduleApi";
import { useSchedule } from "../../context/scheduleContext";
import TableSchedule from "../../components/TableSchedule/TableSchedule";
import { useHeader } from "../../context/headerContext";

const Schedule = () => {
    const [shift, setShift] = useState(1);
    const [time, setTime] = useState(false);

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();
    const {isShift, setIsShift, combination, setCombination} = useSchedule();

    const {data: combinations} = useGetCombinationQuery();
    const { data: shiftData } = useGetShiftQuery(combination, {  
        skip: !combination,
        refetchOnMountOrArgChange: true
    });
    const { data: lessonData } = useGetLessonQuery(combination, {
        skip: !combination,
        refetchOnMountOrArgChange: true
    });

    useEffect(() =>{
        hideSearch();
        setHeader('Weekly schedule');
        setDescription('All lessons in one place');
    }, [])

    useEffect(() => {
        if(shiftData != undefined) {
            setIsShift(shiftData != 0 ? true : false)
            console.log(shiftData)
            shiftData != 0 && setShift(shiftData)
        }
    }, [shiftData]) 
 
    useEffect(() => {
        console.log(lessonData)
        if(lessonData?.length > 0) setIsShift(true);
        else setIsShift(false)
    }, [lessonData])

    const handleReport = () => {
        console.log('report')
    }

    const switchShift = () => setShift(prev => prev == 1 ? 2 : 1)

    const setCombinationClass = (el) => setCombination(el.id)

    return(
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombinationClass} defaultValue={combinations?.find(cb => cb.id == combination)?.name}/>
                <TextButton name={'Shift'}>
                    <Button data={shift} callback={!isShift ? switchShift : undefined} />
                </TextButton>
                <Button data={ClockIcon} active={time} callback={() => setTime(!time)} />
                <Button data={CloudIcon} callback={handleReport} />
            </div>
            <TableSchedule shift={shift} lessonData={lessonData} time={time}/>
        </>
    )  
};

export default Schedule;
