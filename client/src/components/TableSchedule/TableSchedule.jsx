    import React, { useMemo, useState } from "react";
import st from "./TableSchedule.module.scss";
import AddIcon from '../../assets/icons/add.svg';
import {week, colorLesson, iconLesson} from './constants.js'
import { useAddLessonMutation, useDeleteLessonMutation, useGetScheduleQuery, useGetSubjectQuery, useUpdateLessonMutation } from "../../store/api/scheduleApi";
import Select from "../UI/Select/Select.jsx";
import Input from "../UI/Input/Input.jsx";
import { useSchedule } from "../../context/scheduleContext.js";
import Modal from "../UI/Modal/Modal.jsx";

const TableSchedule = ({shift, lessonData}) => {
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
                    <TableItem key={index} day={weekday} times={scheduleData[weekday]} lessons={lessons[weekday]}/>               
                ))}
            </div>
        </div>
    )
};

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
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);

    const {combination} = useSchedule()
    
    return (
        <>
            <div className={st.lesson} onClick={lesson ? () => setIsOpenUpdate(true) : (combination ? () => setIsOpenAdd(true) : undefined)}>
                {lesson ? (
                    <div className={st.leesonItem} style={{backgroundColor: colorLesson[index]}} >
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
                    <div className={st.noLesson}>
                        <div className={st.textLesson}>
                            <p>Add a lesson</p>
                            <p>at this time</p>
                        </div>
                        <img src={AddIcon} alt="+" />
                    </div>
                )}
            </div>
            {isOpenAdd && <ModalSchedule active={isOpenAdd} callback={setIsOpenAdd} time={time} />}
            {isOpenUpdate && <ModalSchedule active={isOpenUpdate} callback={setIsOpenUpdate} time={time} id_lesson={lesson?.id}/>}
        </>
    )
}

const ModalSchedule = ({active, callback, time, id_lesson}) => {
    const [input, setInput] = useState({});
    
    const {combination} = useSchedule();

    const {data: subjects} = useGetSubjectQuery();
    const [addLesson] = useAddLessonMutation(); ////
    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();

    const handleInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleConfirm = async () => {
        try {
            const lessonData = {
                classroom: input.classroom,
                id_project: input.subject?.id,
                id_combination: combination,
                id_sd: time.id,
            };

            if(lessonData.classroom)
                if(!checkClassroom(lessonData.classroom))
                    throw new Error('The cabinet must contain a number and less than 6 characters!')

            await addLesson(lessonData).unwrap(); // .unwrap() позволяет обработать результат или ошибк
        } catch (error) {
            console.error('Failed to add lesson: ', error);
            alert('To add a lesson to your schedule, you must specify a subject!')
        }
    }

    const handleUpdate = async () => {
        try{
            const lessonData = {
                id: id_lesson,
                id_project: input.subject?.id,
                classroom: input.classroom
            }

            if(lessonData.classroom)
                if(!checkClassroom(lessonData.classroom))
                    throw new Error('The cabinet must contain a number and less than 6 characters!')

            await updateLesson(lessonData).unwrap();
        }catch(error){
            console.error('Failed to update lesson: ', error);
            alert('At least one field must be filled in to make the change!')
        }
    }

    const handleDelete = async() => {
        try{
            await deleteLesson(id_lesson).unwrap();
        }catch(error){
            console.error('Failed to delete lesson: ', error);
        }
    }

    return(
        <Modal
            active={active}
            callback={callback}
            onClose={!id_lesson ? undefined : handleDelete}
            onConfirm={!id_lesson ? handleConfirm : handleUpdate}
            textHeader={!id_lesson ? 'Add a day to schedule' : 'Change a day to schedule'}
            textConfirm={!id_lesson ? 'Add' : 'Update'}
            textClose={!id_lesson ? 'Close' : 'Delete'}
        >
            <Select placeholder={'Subject'} data={subjects} callback={handleInput}/>
            <Input placeholder={'Classroom'} callback={handleInput}/> 
        </Modal>
    )
}


const checkClassroom = (classroom) => {
    const classroomRegex = /^\d[\d\-А-Яа-яA-Za-z]{0,4}$/;
    return classroomRegex.test(classroom) && classroom.length <= 5;
}

// для страницу учитель шедуле, а сверзу ля просто шедуле

//id_lesson list of select modal
//teacher = id query
const addLessonScheduleTeacher = ({id_combination}) => { //но апдейт

}


//id_lesson query = lesson.id
// id_teacher = null
const deleteLessonScheduleTeacher = ({id }) => {
}