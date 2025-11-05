import React, { useEffect, useState } from "react";
import st from "./BellLessons.module.scss";
import { useLazyGetScheduleLazyQuery, useUpdateTimeMutation } from "../../../store/api/scheduleApi";
import { colorLesson } from "../../TableSchedule/constants";
import Modal from "../../UI/Modal/Modal";
import Input from "../../UI/Input/Input";
import useErrorHandler from "../../../hooks/useErrorHandler";

const errorText = 'The time must be in xx:yy format.'

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

    return (
        <div className={st.bellLesson}>
            {bell && bell.map((el, index) => (
                <BellLessonItem key={index} id={el.id_time} start={el.time_start} end={el.time_end} index={index}/>
            ))}
        </div>
    )
};

export default BellLessons;

const BellLessonItem = ({id, start, end, index}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState({});
    
    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const [updateTime] = useUpdateTimeMutation();

    useEffect(() => {
        setInput({})
        clearAllErrors();
    }, [])

    const handleInput = (field, value) => {
        setInput(prev => ({
            ...prev,
            [field]: value
        }))

        clearError(field);

        if(!isValidTime(value)){
            if(field == 'time_start') handlerError(new Error(errorText), 'time_start')
            if(field == 'time_end') handlerError(new Error(errorText), 'time_end')
        }
    }

    const handleUpdate = async () => {
        try{
            if (!input.time_start && !input.time_end) {
                handlerError(new Error('To change, all fields must be filled in!'));
                return;
            }

            if (!isValidTime(input.time_start)) {
                handlerError(new Error(errorText), 'time_start');
                return;
            }

            if (!isValidTime(input.time_end)) {
                handlerError( new Error(errorText), 'time_end');
                return;
            }
            console.log(id)
            const lessonData = {
                id,
                time_start: input.time_start,
                time_end: input.time_end
            }

            await updateTime(lessonData).unwrap();
            setIsOpen(false);
        }catch(error){
            handlerError(error);
        }
    }

    const handleClose = () => setIsOpen(false);

    return(
        <>
            <div className={st.lessonContainer} onClick={() => setIsOpen(true)}>
                <div className={st.line} style={{'backgroundColor': colorLesson[index]}}></div>
                <div className={st.text}>
                    <p>{index + 1} Lesson</p>
                    <p>{start} - {end}</p>
                </div>
            </div>
            <Modal
                active={isOpen}
                callback={setIsOpen}
                onClose={handleClose}
                onConfirm={handleUpdate}
                textHeader={`Change the bell time for a ${index + 1} lesson`}
                textConfirm={'Update'}
                textClose={'Close'}
            >
                <Input placeholder={'Time_start'} callback={handleInput} error={errors.time_start}/>
                <Input placeholder={'Time_end'} callback={handleInput} error={errors.time_end}/>
            </Modal>
        </>
    )
}


const isValidTime = (timeStr) => {
    if (!/^\d{2}:\d{2}$/.test(timeStr)) {
        return false;
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    return hours >= 0 && hours <= 12 && 
           minutes >= 0 && minutes <= 59;
};