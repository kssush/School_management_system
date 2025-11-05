import React, { useMemo } from "react";
import st from "./TableSchedule.module.scss";
import {week} from './constants.js'
import { useGetScheduleQuery } from "../../store/api/scheduleApi";
import TableItem from "./TableItem/TableItem.jsx";

const TableSchedule = ({shift, lessonData}) => {
    const isTeacherSchedule = window.location.href.includes('teacherSchedule'); 

    const { data: times } = useGetScheduleQuery(shift, {
        skip: !shift
    });
    

    const scheduleData = useMemo(() => {
        if (!times) return {};

        return week.reduce((acc, day) => {
            acc[day] = times.filter(element => element.weekday == day).slice(0, 6);
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
            
            if (day) acc[day].push(lesson);
            
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
                    <TableItem key={index} day={weekday} times={scheduleData[weekday]} lessons={lessons[weekday]} isTeacherSchedule={isTeacherSchedule}/>               
                ))}
            </div>
        </div>
    )
};

export default TableSchedule;