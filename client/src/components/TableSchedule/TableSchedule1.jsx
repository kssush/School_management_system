import React, { memo, useEffect, useMemo, useState } from "react";
import st from "./TableSchedule.module.scss";
import { useGetScheduleQuery, useGetSubjectQuery } from "../../store/api/scheduleApi.js";
import AddIcon from '../../assets/icons/add.svg';
import {week, colorLesson, iconLesson} from './constants.js'
import Modal from "../UI/Modal/Modal.jsx";
import { useSchedule } from "../../context/scheduleContext.js";
import Input from "../UI/Input/Input.jsx";
import Select from "../UI/Select/Select.jsx";

const isPageSchedule = window.location.href.includes('teacherSchedule');

let modalContent = {}

if(isPageSchedule){
    modalContent = {
        textHeaderAdd: 'Add a lesson',
        textHeaderDelete: 'Delete a lesson',
        textCloseAdd: 'Delete',
        textCloseDelete: 'Close',
        textConfirmAdd: 'Add',
        textConfirmDelete: 'Close'
    }
}else{
    modalContent = {
        textHeaderAdd: 'Add a day to schedule',
        textHeaderDelete: 'Change a day to schedule',
        textCloseAdd: 'Close',
        textCloseDelete: 'Delete',
        textConfirmAdd: 'Add',
        textConfirmDelete: 'Update'
    }
}

const TableSchedule = memo(({shift, lessonData}) => {
    const { data: times, refetch: refetchTimes } = useGetScheduleQuery(shift, {
        skip: !shift
    });
    
    const scheduleData = useMemo(() => {
        if (!times) return {};

        return week.reduce((acc, day) => {
            acc[day] = times
                .filter(element => element.weekday == day)
                .slice(0, 6);
            return acc;
        }, {});
    }, [times]);

    const lessons = useMemo(() => {
        if (!lessonData) return {};

        const initialData = week.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {});

        return lessonData.reduce((acc, lesson) => {
            const dayIndex = Math.floor((lesson.id_sd - 1) / 12);
            const day = week[dayIndex];
            
            if (day) {
                acc[day].push(lesson);
            }
            
            return acc;
        }, initialData);
    }, [lessonData])

    return (
        <div className={st.table}>
            <div className={st.time}>
                <div></div>
                {Object.keys(scheduleData).length != 0 && scheduleData['Monday'].map((time, index) => (
                    <div key={index}>
                        {time.time_start}
                    </div>
                ))}
            </div>
            <div className={st.days}>
                {week.map((weekday, index) => (                   
                    <TableItem key={index} day={weekday} times={scheduleData[weekday]} lessons={lessons[weekday]}/>               
                ))}
            </div>
        </div>
    )
});

export default TableSchedule;


const TableItem = ({day, times, lessons}) => {
    const lessonsMap = useMemo(() => {
        const map = new Map();

        lessons?.forEach(lesson => map.set(lesson.id_sd, lesson));

        return map;
    }, [lessons]);

    return (
        <div className={st.day}>
            <div className={st.header}>
                {day}
            </div>
            {times?.map((time, index) => <LessonItem key={time.id} time={time} lesson={lessonsMap.get(time.id)} index={index}/> 
            )}
        </div>
    )
}


//memo?
const LessonItem = ({time, lesson, index}) => {
    const {addFunc, deleteFunc, isCombination} = useSchedule();
    const {data: subjects} = useGetSubjectQuery();

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleAddLesson = () => {
        setInput({})
        setIsOpenAdd(true);
        setIsOpenDelete(false);
    }

    const handleUpdateLesson = () => {
        setInput({})
        setIsOpenAdd(false);
        setIsOpenDelete(true);
    }

    const deleteLesson = () => {
        deleteFunc(); /////////////
    }

    const addLesson = () => {
        console.log(input)

        let lessonData = {};

        if(!isPageSchedule){
            lessonData = {
                id_project: input.subject?.id
            }
        }

        // addFunc({...input}); ////////
    }

    const updateLesson = () => {
        console.log('update');
    }

    const defaultClose = () => {
        setIsOpenAdd(false);
        setIsOpenDelete(false);
        setInput({})
    }

    const [input, setInput] = useState({});

    const handleInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={st.lesson}>
            {lesson ? (
                <div className={st.leesonItem} style={{backgroundColor: colorLesson[index]}} onClick={() => handleUpdateLesson()}>
                    <div className={st.icon}>
                        <img src={iconLesson[lesson.project]} alt="sub" />
                    </div>
                    <div className={st.text}>
                        <p>{lesson.project}</p>
                        <p>{time.time_start} - {time.time_end}</p>
                    </div>
                    <div className={st.classroom}>
                        #{lesson?.classroom ? lesson.classroom : ' - '}
                    </div>
                </div>
            ) : (
                <div className={st.noLesson} onClick={() => isCombination ?  handleAddLesson() : undefined}>
                    <div className={st.textLesson}>
                        <p>Add a lesson</p>
                        <p>at this time</p>
                    </div>
                    <img src={AddIcon} alt="+" />
                </div>
            )}
            {(isOpenAdd || isOpenDelete) && (
                <Modal 
                    toggle={isOpenAdd ? setIsOpenAdd : setIsOpenDelete}
                    textHeader = {isOpenAdd ? modalContent.textHeaderAdd : modalContent.textHeaderDelete}
                    textClose = {isOpenAdd ? modalContent.textCloseAdd : modalContent.textCloseDelete}
                    textConfirm = {isOpenAdd ? modalContent.textConfirmAdd : modalContent.textConfirmDelete}
                    onClose = {isOpenAdd ? defaultClose :  deleteLesson}
                    onConfirm = {isOpenAdd ?  addLesson : !isPageSchedule ? updateLesson : defaultClose}
                >
                    {!isPageSchedule ? (
                        isOpenAdd ? (
                            <>
                                <Select placeholder={'Subject'} data={subjects} callback={handleInput}/>
                                <Input placeholder={'Classroom'} callback={handleInput}/> 
                            </>
                        ) : (
                            <>
                                <Select placeholder={'Subject'} data={subjects} callback={handleInput}/>
                                <Input placeholder={'Classroom'} callback={handleInput}/> 
                            </>
                        )
                    ) : (
                        isOpenAdd ? (
                            <>
                                <Select placeholder={'Class'} callback={handleInput}/>
                                {/*-------*/}
                            </>
                        ) : (
                            <></>
                        )
                    )}
                </Modal>
            )}
        </div> 
    )
}