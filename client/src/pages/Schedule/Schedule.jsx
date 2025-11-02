import React, { useEffect, useMemo, useState } from "react";
import st from "./Schedule.module.scss";
import { useMain } from "../../context/mainContext";
import SelectName from "../../components/UI/SelectName/SelectName";
import Button from "../../components/UI/Button/Button";
import CloudIcon from '../../assets/icons/cloud.svg'
import ClockIcon from '../../assets/icons/clock.svg'
import TextButton from "../../components/UI/TextButton/TextButton";
import TableSchedule from "../../components/TableSchedule/TableSchedule";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { useAddLessonMutation, useDeleteLessonMutation, useGetLessonQuery, useGetShiftQuery } from "../../store/api/scheduleApi";
import { useSchedule } from "../../context/scheduleContext";

const Schedule = () => {
    const [classes, setCalsses] = useState(null);
    const [shift, setShift] = useState({check: false, value: 1});
    const [buttons, setButtons] = useState({});

    const {setHeader, setDescription} = useMain();
    const {setAddFunc, setDeleteFunc, setIsCombination} = useSchedule();
 
    const { data } = useGetCombinationQuery();
    const { data: shiftData } = useGetShiftQuery(classes?.id, {
        skip: !classes
    });
    const { data: lessonData, refetch: refetchLessons } = useGetLessonQuery(classes?.id, {
        skip: !classes?.id
    });

    const [addLessonMutation] = useAddLessonMutation();
    const [deleteLessonMutation] = useDeleteLessonMutation();

    const scheduleActions = useMemo(() => ({
        addLesson: async (lessonData) => {
            try {
                if (!lessonData || !lessonData.id_sd) {
                    throw new Error('Invalid lesson data');
                }
                
                const result = await addLessonMutation(lessonData).unwrap();
                console.log('Lesson added successfully:', result);
                return result;
            } catch (error) {
                console.error('Failed to add lesson:', error);
                throw error;
            }
        },
        
        deleteLesson: async (lessonId) => {
            try {
                if (!lessonId || typeof lessonId !== 'number') {
                    throw new Error('Invalid lesson ID');
                }
                
                const result = await deleteLessonMutation(lessonId).unwrap();
                console.log('Lesson deleted successfully:', result);
                return result;
            } catch (error) {
                console.error('Failed to delete lesson:', error);
                throw error;
            }
        }
    }), [addLessonMutation, deleteLessonMutation]);

    useEffect(() =>{
        setHeader('Weekly schedule');
        setDescription('All lessons in one place');
    }, [])

    useEffect(() => {
        setAddFunc(() => scheduleActions.addLesson);
        setDeleteFunc(() => scheduleActions.deleteLesson);
    }, [scheduleActions, setAddFunc, setDeleteFunc]);

    useEffect(() => {
        if(lessonData && lessonData.length > 0){
            setShift(prev => ({
                check: true,
                value: prev.value
            }))
        }else{
            setShift(prev => ({
                check: false,
                value: prev.value
            }))
        }
    }, [lessonData])

    useEffect(() => {
        if(classes) { /////////////////////////
            setShift({check: false, value: 1});
            setIsCombination(true);
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
