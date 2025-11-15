import React, { useState } from 'react';
import st from './LessonItem.module.scss';
import LessonItemBlock from '../LessonItemBlock/LessonItemBlock';
import { useSchedule } from '../../../context/scheduleContext';
import { ModalSchedule, ModalScheduleTeacher } from '../Modal/Modal';
import { colorLesson } from '../constants';
import AddIcon from '../../../assets/icons/add.svg';
import { useUser } from "../../../context/userContext";

const LessonItem = ({time, lesson, index, isTeacherSchedule}) => {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);

    const {role} = useUser();
    const {combination} = useSchedule()

    return (
        <>
            <div className={st.lesson} onClick={lesson ? () => setIsOpenUpdate(true) : (combination || isTeacherSchedule ? () => setIsOpenAdd(true) : undefined)}>
                {lesson ? (
                    <LessonItemBlock lesson={lesson} time={time} color={colorLesson[index]}/>
                ) : (
                    <div className={st.noLesson}>
                        <div className={st.textLesson}>
                            <p>Add a lesson</p>
                            <p>at this time</p>
                        </div>
                        <img src={AddIcon} alt="+" />
                    </div>
                )}
            </div>
            {['admin'].includes(role) && isOpenAdd && (!isTeacherSchedule ?
                <ModalSchedule active={isOpenAdd} callback={setIsOpenAdd} time={time} /> :
                <ModalScheduleTeacher active={isOpenAdd} callback={setIsOpenAdd} time={time}/>)
            }
            {['admin'].includes(role) && isOpenUpdate && (!isTeacherSchedule ? 
                <ModalSchedule active={isOpenUpdate} callback={setIsOpenUpdate} time={time} id_lesson={lesson?.id}/> :
                <ModalScheduleTeacher active={isOpenUpdate} callback={setIsOpenUpdate} id_lesson={lesson?.id}/>)
            }
        </>
    )
}

export default LessonItem;