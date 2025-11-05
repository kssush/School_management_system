import React from 'react';
import st from './LessonItemBlock.module.scss';
import { iconLesson } from '../constants';

const LessonItemBlock = ({lesson, time, color, onCLick}) => {
    console.log(lesson)
    return (
        <div className={`${st.leesonItem} ${onCLick && st.leesonItemModal}`} onClick={onCLick} style={{backgroundColor: color ?? 'none'}}>
            <div className={st.icon}>
                <img src={iconLesson[lesson.project]} alt="sub" />
            </div>
            <div className={st.text}>
                <p>{lesson.project}</p>
                <p>{time?.time_start ?? lesson.time_start} - {time?.time_end ?? lesson.time_end}</p>
            </div>
            <div className={st.classroom}>
                #{lesson?.classroom ? lesson.classroom : ' - '}
            </div>
            {lesson.name && (
                <div className={st.teacherBox}>
                    <p>Teacher:</p>
                    <p>{lesson.surname} {lesson.name}</p>
                </div>
            )}
        </div>
    )
}

export default LessonItemBlock;