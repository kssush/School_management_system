import React, { useEffect, useMemo, useState } from "react";
import st from "./TableSchedule.module.scss";
import {week} from './constants.js'
import { useGetScheduleQuery } from "../../store/api/scheduleApi";
import TableItem from "./TableItem/TableItem.jsx";

const TableSchedule = ({shift, lessonData, time = false}) => {
    const [timeHeight, setTimeHeight] = useState(null);

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


    useEffect(() => {
        if(time && scheduleMinutes.length != 0){
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const totalMinutes = hours * 60 + minutes;

            console.log(totalMinutes, hours, scheduleMinutes) // timeFor .. [08:00 / 09:00 09:55 11:10 12:05]
            
            if(totalMinutes >  Math.min(...scheduleMinutes) && totalMinutes < Math.max(...scheduleMinutes)){
                for(let i = 0; i < scheduleMinutes.length - 1; i++){
                    let current = scheduleMinutes[i];
                    let differentCurrent = current - totalMinutes;

                    if(differentCurrent <= 0){
                        let differentNext = scheduleMinutes[i + 1] - current;

                        let percent = -differentCurrent * 100 / differentNext

                        setTimeHeight((i * 5 + 5 * percent / 100 + 5)) // height = 5rem lesson item
                        break;
                    }
                }
            }else{
                setTimeHeight(null)
            }
        }
    }, [time, shift, scheduleData])
    
    const scheduleMinutes = useMemo(() => {
        if(Object.keys(scheduleData).length == 0) return [];

        const temp = scheduleData['Monday'].map(el => el.time_start).map(timeStr => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        });

        temp.push(temp[temp.length - 1] + 45);
        
        return temp;
    }, [scheduleData])

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
            {time && <div className={st.timeline} style={{ top: timeHeight ? `${timeHeight}rem` : undefined }}>
                <div className={st.box}>now</div>
                <div className={st.line}></div>
            </div>}
        </div>
    )
};

export default TableSchedule;