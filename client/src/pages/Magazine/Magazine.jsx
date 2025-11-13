import React, { useEffect, useMemo, useRef, useState } from "react";
import st from "./Magazine.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import AddIcon from '../../assets/icons/add.svg'
import DoneIcon from '../../assets/icons/done.svg'
import ArrowIcon from '../../assets/icons/arrow.svg'
import AbsenceIcon from '../../assets/icons/absence.svg'
import RemarkIcon from '../../assets/icons/remark.svg'
import SelectName from "../../components/UI/SelectName/SelectName";
import Button from "../../components/UI/Button/Button";
import { useGetSubjectForClassQuery } from "../../store/api/scheduleApi";
import { useGetClassQuery, useGetCombinationQuery } from "../../store/api/classApi";
import { useAddDayMutation, useAddPerformanceMutation, useGetMagazineQuery, useGetPerformanceQuery, useUpdateDayMutation, useUpdatePerformanceMutation } from "../../store/api/magazineApi";
import Modal from '../../components/UI/Modal/Modal'
import Input from '../../components/UI/Input/Input'
import useErrorHandler from "../../hooks/useErrorHandler";
import Select from "../../components/UI/Select/Select";

const defData = new Date().toISOString().split('T')[0];

const Magazine = () => {
    const [date, setDate] = useState(defData);
    const [combination, setCombination] = useState(null);
    const [subject, setSubject] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [viewSetting, setViewSetting] = useState({mark: true, remark: false, pass: false, reviewed: false});

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();
    
    const {data: combinations} = useGetCombinationQuery();
    const {data: subjects} = useGetSubjectForClassQuery(combination?.id, {
        skip: !combination
    });
    const {data: students} = useGetClassQuery(combination?.id_class, {
        skip: !combination
    });
    const {data: magazines} = useGetMagazineQuery({
        id_class: combination?.id_class,
        id_project: subject?.id,
        date: date
    }, {
        skip: !combination || !subject
    })
    const {data: performances} = useGetPerformanceQuery({
        id_class: combination?.id_class,
        id_project: subject?.id,
        date: date 
    }, {
        skip: !combination || !subject
    });

    console.log('sibject:', subject, '\nmagazine:', magazines, '\nperformance', performances)

    console.log(students)

    useEffect(() =>{
        setHeader('Magazine');
        setDescription('All lessons in one place');
        hideSearch();
    }, [])

    useEffect(() => {
        defaulDate();
    }, [combination, subject])      

    const defaulDate = () => setDate(defData);

    const handleOpenModal = () => setOpenModal(true);

    const handleToggleViewSetting = (setting) => setViewSetting(prev => ({
        ...prev,
        [setting]: !prev[setting]
    }))

    const swipeMonth = (side) => {
        const tDate = new Date(date);

        let month = tDate.getMonth() + 1;
        let year = tDate.getFullYear();

        month = side == 'left' ? month - 1 : month + 1;
        
        if(month == 0){
            year--;
            month = 12;
        }

        if(month == 13){
            year++;
            month = 1;
        }

        setDate(new Date(`${year}-${month}-5`).toISOString().split('T')[0])
    }

    const isMin = () => new Date(date).getMonth() == 8
    const isMax = () => new Date(date).getMonth() == 4

    return (
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombination} />
                <SelectName name={'Subject'} data={subjects} callback={setSubject} />
                <Button data={AddIcon} callback={handleOpenModal}/>
                <Button data={AbsenceIcon} active={viewSetting.pass} callback={() => handleToggleViewSetting('pass')}/>
                <Button data={RemarkIcon} active={viewSetting.remark} callback={() => handleToggleViewSetting('remark')}/>
                <Button data={'5'} active={viewSetting.mark} callback={() => handleToggleViewSetting('mark')}/>
                <Button data={DoneIcon} active={viewSetting.reviewed} callback={() => handleToggleViewSetting('reviewed')}/>
                <Button data={ArrowIcon} callback={!isMin() ? () => swipeMonth('left') : undefined} disabledStyle={isMin()}/>
                <Button data={ArrowIcon} callback={!isMax() ? () => swipeMonth('right') : undefined} disabledStyle={isMax()}/>
            </div>
            <MagazineTable students={students} magazines={magazines} performances={performances} classBag={{id_class: combination?.id_class}} viewSetting={viewSetting}/>
            <AddLessonModal active={openModal} callback={setOpenModal} id_class={combination?.id_class} id_project={subject?.id} defaultCallback={defaulDate}/>
        </>  
    );
};

export default Magazine;


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


const MagazineTable = ({ students, magazines, performances, viewSetting, children }) => {
    const [openModal, setOpenModal] = useState({updateLesson: false, performance: false});
    const [lessonId, setLessonId] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [performanceData, setPerformanceData] = useState({id: null, remark: null});
    
    const handleOpenModal = (name) =>{
        setOpenModal(prev => ({
            ...prev,
            [name]: true
        }))
    }
    const handleCloseModal = () => setOpenModal({updateLesson: false, performance: false})

    const handleClick = (event) => {
        const studentId = event.target.dataset.studentId;
        const lessonId = event.currentTarget.dataset.lessonId
        const performanceId = event.target.dataset.performId;
        const performanceRemark = event.target.dataset.performRemark;

        setLessonId(lessonId)
        if(!studentId) {
            handleOpenModal('updateLesson');
        }else{
            setStudentId(studentId)
            setPerformanceData(prev => ({...prev, id: performanceId ? performanceId : null}));
            setPerformanceData(prev => ({...prev, remark: performanceRemark ? performanceRemark : null}));
 
            handleOpenModal('performance')
        }
    }

    return ( 
        <>
            <div className={st.magazine}>
                {students ?
                    (
                        <div className={st.column}>
                            <div className={st.header}>
                                <p>№</p>
                                <p>Surname Name</p>
                            </div>
                            {students?.map((student, index) => (
                                <div key={student.id}>
                                    <p>{index + 1}</p>
                                    <p>{student.surname} {student.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={st.noClass}>Select class</div>
                    )
                }
                {magazines && magazines.length > 0?
                    (
                        <div className={st.box}>
                            {magazines?.map((lessons, index) => (
                                lessons?.lessons?.map((lesson, lessonIndex) => {
                                    const performance = performances?.[lesson.id]

                                    return(
                                        <div className={st.column1} key={lesson.id} data-lesson-id={lesson.id} onClick={handleClick}>   
                                            <div className={st.header} onClick={handleClick}>
                                                {lessons.formatDate}
                                                {lesson.lesson && (
                                                    <div className={st.lessonBox}>
                                                        <p>{lesson.lesson}</p>
                                                        <p>lesson</p>
                                                        <p>{lesson.homework}</p>
                                                        {lesson.homework && <p>homework</p> }
                                                    </div>  
                                                )}
                                            </div>               
                                            {students?.map((student, index) => {
                                                const perform = performance && performance.find(perf => perf.id_student == student.id)
                                                
                                                if(perform){
                                                    return(
                                                        <div
                                                            key={student.id}
                                                            data-student-id={student.id}
                                                            data-perform-id={perform.id}
                                                            data-perform-remark = {perform.remark}
                                                            className={`${viewSetting.remark && perform.remark ? st.remark : ''} ${viewSetting.pass && perform.pass == true ? st.pass : ''}`}
                                                        > 
                                                            {viewSetting.remark && perform.remark && <div className={st.remarkBox}>
                                                                <p>{perform.remark}</p>
                                                                <p>remark</p>
                                                            </div>  }
                                                            {viewSetting.pass && perform.pass ? '-' : ''}
                                                            {!perform.pass && <>{viewSetting.mark && perform.mark} {viewSetting.remark && perform.remark ? '!' : null}</> }
                                                        </div> 
                                                    )
                                                }

                                                return <div key={student.id} data-student-id={student.id} />
                                            })}
                                        </div>
                                    )
                                })
                            ))}
                        </div>
                    ) : (
                    <div className={students ? st.noSubject : st.noElement}>{magazines ? 'No lesson' : 'Select subject'}</div> 
                    )
            }
            </div>
            <AddLessonModal active={openModal.updateLesson} callback={handleCloseModal} id_lesson={lessonId}/>
            <PerformanceModal active={openModal.performance} callback={handleCloseModal} id_magazine={lessonId} id_student={studentId} id_performance={performanceData.id} remark={performanceData.remark}/>
        </>
    )
}

const PerformanceModal = ({active, callback, id_magazine, id_student, id_performance, remark = false}) => {
    const [input, setInput] = useState({});
    console.log('324', remark)
    const { errors, handlerError, clearError, clearAllErrors } = useErrorHandler();

    const [addPerformance] = useAddPerformanceMutation();
    const [updatePerformance] = useUpdatePerformanceMutation();

    useEffect(() => {
        if(active){
            setInput({})
            clearAllErrors();
        }
    }, [active])

    const handleInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: name != 'pass' ? value : value.name == 'Presence' ? false : true
        }))

        clearError(name);

        if(name == 'mark'){
            value = Number(value);

            if (!Number.isInteger(value) || value < 0 || value > 5) {
                handlerError(
                    new Error('Marks range from 0 to 5. Use 0 to remove the mark.'), 
                    name
                );
            }
        }
        
        if(name == 'remark'){
            const temp = value.trim();

            if(temp.length != '' && (temp.length < 6 || temp.length > 40)){
                handlerError(
                    new Error('The remark must contain more than 6 and less than 40 letters!'), 
                    name
                );
            }
        
            if(temp == ''){
                setInput(prev => ({
                    ...prev,
                    [name]: undefined
                }))
            }
        }
    }

    const handleCloseModal = () => callback(false);

    const handleAddPerformance = async () => {
        try{
            if(!id_magazine) {
                handlerError(new Error('To add a performance, select a lesson!'));
                return;
            }

            if(!id_student) {
                handlerError(new Error('To add a performance, select a student!'));
                return;
            }

            if(Object.values(input).length == 0) {
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }
            
            if(input.mark){
                let value = Number(input.mark);

                if (!Number.isInteger(value) || value < 0 || value > 5) {
                    handlerError( new Error('Marks range from 0 to 5. Use 0 to remove the mark.'));
                    return;
                }
            }
            
            if(input.remark){
                let value = input.remark;
                
                if(value.length < 6 || value.length > 40){
                    handlerError(new Error('The remark must contain more than 6 and less than 40 letters!'));
                    return;
                }
            }

            if(input.pass == true) setInput(prev => ({pass: true}))

            await addPerformance({id_magazine, id_student, ...input});
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    const handleUpdatePerformance = async () => {
        try{
            if(!id_performance) {
                handlerError(new Error('To add a performance, select a performance!'));
                return;
            }

            if(Object.values(input).length == 0) {
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }
            
            if(input.mark){
                let value = Number(input.mark);

                if (!Number.isInteger(value) || value < 0 || value > 5) {
                    handlerError(new Error('Marks range from 0 to 5. Use 0 to remove the mark.'));
                    return;
                }
            }

            if(input.remark){
                let value = input.remark;
               
                if(value.length < 6 || value.length > 40){
                    handlerError(new Error('The remark must contain more than 6 and less than 40 letters!'));
                    return;
                }
            }

            if(input.pass == true) setInput(prev => ({pass: true}))

            await updatePerformance({id: id_performance, ...input});
            handleCloseModal();
        }catch(error){
            handlerError(error);
        }
    }

    const handleRemoveRemark = async () => {
        await updatePerformance({id: id_performance, remark: null});
        handleCloseModal();
    }

    return(
        <Modal
            callback={callback}
            active={active}
            textHeader={!id_performance ? 'Add performance' : 'Update the perfomance'}
            textClose={'Close'}
            textConfirm={!id_performance ? 'Add' : 'Update'}
            onClose={handleCloseModal}
            onConfirm={!id_performance ? handleAddPerformance : handleUpdatePerformance}
        >   
            <Select placeholder={'Pass'} data={[{name: 'Absence'}, {name: 'Presence'}]} callback={handleInput}/>
            <Input placeholder={'Mark'} callback={handleInput} error={errors.mark} /> 
            <Input placeholder={'Remark'} callback={handleInput} error={errors.remark}/> 
            {remark && <button className={st.removeRemark} onClick={handleRemoveRemark}>Click to remove the remark</button>}
        </Modal>
    )
}

