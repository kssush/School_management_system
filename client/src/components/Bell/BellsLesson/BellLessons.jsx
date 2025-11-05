import React, { useEffect, useState } from "react";
import st from "./BellLessons.module.scss";
import { useLazyGetScheduleLazyQuery } from "../../../store/api/scheduleApi";
import { colorLesson } from "../../TableSchedule/constants";

const BellLessons = ({shift}) => {
    const [bell, setBell] = useState(null);

    const [getSchedule, {data: schedule}] = useLazyGetScheduleLazyQuery();

    useEffect(() => {
        getSchedule(shift)
    }, [shift])

    useEffect(() => {
        if(schedule){
            const day = schedule[0].weekday;

            setBell(schedule.filter(el => el.weekday == day));
        }
    }, [schedule])

    console.log(bell)

    return (
        <div className={st.bellLesson}>
            {bell && bell.map((el, index) => (
                <BellLessonItem key={index} id={el.id} start={el.time_start} end={el.time_end} index={index}/>
            ))}
        </div>
    )
};

export default BellLessons;

const BellLessonItem = ({id, start, end, index}) => {
    return(
        <div className={st.lessonContainer}>
            <div className={st.line} style={{'backgroundColor': colorLesson[index]}}></div>
            <div className={st.text}>
                <p>{index + 1} Lesson</p>
                <p>{start} - {end}</p>
            </div>
        </div>
    )
}