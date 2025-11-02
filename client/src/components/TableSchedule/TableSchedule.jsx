import React, { memo, useEffect, useMemo, useState } from "react";
import st from "./TableSchedule.module.scss";
import { useGetScheduleQuery } from "../../store/api/scheduleApi";
import AddIcon from '../../assets/icons/add.svg';
import {week, colorLesson, iconLesson} from './constants.js'
import Modal from "../UI/Modal/Modal.jsx";
import { useSchedule } from "../../context/scheduleContext.js";
import Input from "../UI/Input/Input.jsx";
import Select from "../UI/Select/Select.jsx";

const TableSchedule = memo(({shift, lessonData}) => {
    useEffect(() => {
        const startTime = performance.now();
        
        return () => {
            const endTime = performance.now();
            console.log(`TableSchedule rendered in: ${endTime - startTime}ms`);
        };
    });

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

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleAddLesson = () => {
        setIsOpenAdd(true);
        setIsOpenDelete(false);
    }

    const handleUpdateLesson = () => {
        setIsOpenAdd(false);
        setIsOpenDelete(true);
    }

    const deleteLesson = () => {
        console.log('delete')
    }

    const addLesson = () => {
        console.log('add')
    }

    const updateLesson = () => {
        console.log('update');
    }

    const defaultClose = () => setIsOpenAdd(false);

    return (
        <div className={st.lesson}>
            {lesson ? (
                <div className={st.leesonItem} style={{backgroundColor: colorLesson[index]}} onClick={() => handleUpdateLesson(time)}>
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
                <div className={st.noLesson} onClick={() => isCombination ?  handleAddLesson(time) : undefined}>
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
                    textHeader = {isOpenAdd ? 'Add a day to schedule' : 'Change a day to schedule'}
                    onClose = {isOpenAdd ? defaultClose :  deleteLesson}
                    textClose = {isOpenAdd ? 'Close' : 'Delete'}
                    onConfirm = {isOpenAdd ?  addLesson : updateLesson}
                    textConfirm = {isOpenAdd ? 'Add' : 'Update'}
                >
                    {isOpenAdd ? (
                        <>
                            <Select placeholder={'Subject'}/>
                            <Input placeholder={'Classroom'}/> 
                        </>
                    ) : (
                        <></>
                    )}
                </Modal>
            )}
        </div> 
    )
}