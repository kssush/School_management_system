import React, { memo, useMemo } from "react";
import st from "./TableItem.module.scss";
import LessonItem from "../LessonItem/LessonItem";

const TableItem = memo(({day, times, lessons, isTeacherSchedule = false}) => {
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
            {times?.map((time, index) => <LessonItem key={time.id} time={time} lesson={lessonsMap.get(time.id)} index={index} isTeacherSchedule={isTeacherSchedule}/> 
            )}
        </div>
    )
})

export default TableItem;
