import React, { memo, useEffect, useMemo } from "react";
import st from "./TableSchedule.module.scss";
import { useGetScheduleQuery } from "../../store/api/scheduleApi";
import AddIcon from '../../assets/icons/add.svg';
import {week, colorLesson, iconLesson} from './constants.js'

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

const LessonItem = ({time, lesson, index}) => {
    const handleAddLesson = (day) => {
        console.log(day)
    }

    const handleUpdateLesson = (day) => {
        console.log(day)
    }

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
                <div className={st.noLesson} onClick={() => handleAddLesson(time)}>
                    <div className={st.textLesson}>
                        <p>Add a lesson</p>
                        <p>at this time</p>
                    </div>
                    <img src={AddIcon} alt="+" />
                </div>
            )}
        </div> 
    )
}