import React, { useEffect, useState } from 'react';
import st from './Modal.module.scss';
import useErrorHandler from '../../../hooks/useErrorHandler';
import { useSchedule } from '../../../context/scheduleContext';
import { useAddLessonMutation, useDeleteLessonMutation, useGetSubjectQuery, useLazyGetLessonLazyQuery, useUpdateLessonMutation } from '../../../store/api/scheduleApi';
import Modal from '../../UI/Modal/Modal';
import Select from '../../UI/Select/Select';
import Input from '../../UI/Input/Input';
import { useParams } from 'react-router-dom';
import LessonItemBlock from '../LessonItemBlock/LessonItemBlock';
import { useGetCombinationQuery } from '../../../store/api/classApi';

export const ModalSchedule = ({active, callback, time, id_lesson}) => {
    const [input, setInput] = useState({});

    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const {combination} = useSchedule();

    const {data: subjects} = useGetSubjectQuery();
    const [addLesson] = useAddLessonMutation(); ////
    const [updateLesson] = useUpdateLessonMutation();
    const [deleteLesson] = useDeleteLessonMutation();

    useEffect(() => {
        if(active){
            setInput({})
            clearAllErrors();
        }
    }, [active])

    const handleInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: value
        }))

        clearError(name);

        if(name == 'classroom' && value && !checkClassroom(value)){
            handlerError(
                new Error('The cabinet must contain a number and less than 6 characters!'), 
                'classroom'
            );
        }
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
            callback(false);
        } catch (error) { ////
            if (error.status === 400) {
                handlerError(new Error('Invalid data sent to server'));
            } else if (error.status === 401) {
                handlerError(new Error('Please login again'));
            } else {
                handlerError(error); 
            }
        }
    }

    const handleUpdate = async () => {
        try{
            if (!input.subject?.id && !input.classroom) {
                handlerError(new Error('At least one field must be filled in to make the change!'));
                return;
            }

            if (input.classroom && !checkClassroom(input.classroom)) {
                handlerError(
                    new Error('The cabinet must contain a number and less than 6 characters!'), 
                    'classroom'
                );
                return;
            }

            const lessonData = {
                id: id_lesson,
                id_project: input.subject?.id,
                classroom: input.classroom
            }

            await updateLesson(lessonData).unwrap();
            callback(false);
        }catch(error){
            handlerError(error);
        }
    }

    const handleDelete = async() => {
        try{
            await deleteLesson(id_lesson).unwrap();
            callback(false);
        }catch(error){
            handlerError(error);
        }
    }

    const handleClose = () => callback(false)

    return(
        <Modal
            active={active}
            callback={callback}
            onClose={!id_lesson ? handleClose : handleDelete}
            onConfirm={!id_lesson ? handleConfirm : handleUpdate}
            textHeader={!id_lesson ? 'Add a day to schedule' : 'Change a day to schedule'}
            textConfirm={!id_lesson ? 'Add' : 'Update'}
            textClose={!id_lesson ? 'Close' : 'Delete'}
        >
            <Select placeholder={'Subject'} data={subjects} callback={handleInput}/>
            <Input placeholder={'Classroom'} callback={handleInput} error={errors.classroom}/> 
        </Modal>
    )
}

const checkClassroom = (classroom) => {
    const classroomRegex = /^\d[\d\-А-Яа-яA-Za-z]{0,4}$/;
    return classroomRegex.test(classroom) && classroom.length <= 5;
}



export const ModalScheduleTeacher = ({active, callback, time, id_lesson}) => {
    const {id_teacher} = useParams();

    const [combination, setCombination] = useState(null);
    const [selectLesson, setSelectLesson] = useState(null);
    
    const {data: combinations} = useGetCombinationQuery();
    const [triggerLesson, { data: modalLesson }] = useLazyGetLessonLazyQuery();
    const [updateLesson] = useUpdateLessonMutation();


    useEffect(() => {
        if(combination) triggerLesson({id: combination, weekday: time.weekday});
    }, [combination])


    const handleSelect = (_, classes) => {
        setCombination(classes.id);
    }
    
    const handleAdd = async () => {
        const lessonData = {
            id: selectLesson.id,
            id_teacher: id_teacher
        }

        await updateLesson(lessonData).unwrap();
        callback(false);
    }

    const handleDelete = async () => {
        const lessonData = {
            id: id_lesson,
            id_teacher: null
        }

        await updateLesson(lessonData).unwrap();
        callback(false);
    }

    const handleClose = () => callback(false)

    return(
        <Modal
            active={active}
            callback={callback}
            onClose={handleClose}
            onConfirm={!id_lesson ? handleAdd : handleDelete}
            textHeader={!id_lesson ? 'Add a lesson' : 'Delete a lesson'}
            textConfirm={!id_lesson ? 'Add' : 'Delete'}
            textClose={!id_lesson ? 'Close' : 'Close'}
        >
            {!id_lesson && (
                <>
                    <Select placeholder={'Class'} data={combinations} callback={handleSelect}/>
                    {modalLesson && modalLesson.length > 0 ? (
                        <div className={st.tcontainer}>
                            {modalLesson.map((lesson, index) => (
                                <LessonItemBlock key={index} lesson={lesson} onCLick={() => setSelectLesson(lesson)} style={{margin: 0}}/>
                            ))}
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </Modal>
    )
}