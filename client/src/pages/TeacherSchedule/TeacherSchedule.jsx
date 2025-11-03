import React, { useEffect, useState } from "react";
import st from "./TeacherSchedule.module.scss";
import { useMain } from "../../context/mainContext";
import TextButton from "../../components/UI/TextButton/TextButton";
import Button from "../../components/UI/Button/Button";
import ClockIcon from '../../assets/icons/clock.svg'
import { useParams } from "react-router-dom";
import { useGetLessonTeacherQuery } from "../../store/api/scheduleApi";
import TableSchedule from "../../components/TableSchedule/TableSchedule";

const TeacherSchedule = () => {
    const {id_teacher} = useParams();

    const [shift, setShift] = useState(1);
    const [time, setTime] = useState(false);

    const {setHeader, setDescription} = useMain();

    const {data: lessonData} = useGetLessonTeacherQuery(id_teacher, {
        skip: !id_teacher
    })

    useEffect(() =>{
        setHeader('Teacher\'s schedule');
        setDescription('All t.\'s schedule in one place');
    }, [])

    console.log('id', id_teacher, 'dt', lessonData)

    return (
        <>
            <div className={st.setting}>
                <TextButton name={'Shift'}>
                    <Button data={'1'} active={shift == 1 ? true : false} callback={() => setShift(1)} />
                    <Button data={'2'} active={shift == 2 ? true : false} callback={() => setShift(2)} />
                </TextButton>
                <Button data={ClockIcon} active={time} callback={() => setTime(!time)} />
            </div>
            <TableSchedule shift={shift} lessonData={lessonData}/>
        </>
    )
};

export default TeacherSchedule;
