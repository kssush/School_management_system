import Modal from '../../UI/Modal/Modal'
import Input from '../../UI/Input/Input'
import useErrorHandler from "../../../hooks/useErrorHandler";
import { useEffect, useState } from 'react';
import { useAddDayMutation, useUpdateDayMutation } from '../../../store/api/magazineApi';

const AddLessonModal = ({active, callback, id_class, id_project, id_lesson, defaultCallback}) => {
    const [input, setInput] = useState({});
    
    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const [addLesson] = useAddDayMutation();
    const [updateLesson] = useUpdateDayMutation();

    useEffect(() => {
        if(active){
            setInput({})
            clearAllErrors();
        }
    }, [active])

    const handleInput = (name, value) => {
        value = value.trim();

        setInput(prev => ({
            ...prev,
            [name]: value
        }))

        clearError(name);

        if(value.length < 10 || value.length > 50){
            handlerError(
                new Error('The value must contain more than 10 and less than 50 letters!'), 
                name
            );
        }
    }

    const handleCloseModal = () => callback(false);

    const handleAddLesson = async () => {
        try{
            if(!id_class) {
                handlerError(new Error('To add a lesson, select a class!'));
                return;
            }

            if(!id_project) {
                handlerError(new Error('To add a lesson, select a subject!'));
                return;
            }

            if(!input.lesson) {
                handlerError(new Error('The lesson topic must be filled in!'));
                return;
            }

            await addLesson({id_class, id_project, lesson: input.lesson, homework: input.homework});
            defaultCallback && defaultCallback();
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    const handleUpdateLesson = async () => {
        try{
            if(!id_lesson) {
                handlerError(new Error('To update, select a lesson!'));
                return;
            }

            if(!input.lesson && !input.homework) {
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }

            await updateLesson({id: id_lesson, lesson: input.lesson, homework: input.homework});
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    return(
        <Modal
            callback={callback}
            active={active}
            textHeader={!id_lesson ? 'Add a lesson' : 'Update the lesson'}
            textClose={'Close'}
            textConfirm={!id_lesson ? 'Add' : 'Update'} 
            onClose={handleCloseModal}
            onConfirm={!id_lesson ? handleAddLesson : handleUpdateLesson}
        >
            <Input placeholder={'Lesson'} callback={handleInput} error={errors.lesson}/> 
            <Input placeholder={'Homework'} callback={handleInput} error={errors.homework}/> 
        </Modal>
    )
}

export default AddLessonModal;