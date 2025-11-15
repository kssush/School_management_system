import React, { useEffect, useState } from "react";
import st from "./Student.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import useFormCreate from "../../hooks/useFormCreate";
import useFormFilter from "../../hooks/useFormFilter";
import usePaggination from "../../hooks/usePaggination";
import CreateSection from "../../components/CreateSection/CreateSection";
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import CardAdd from "../../components/CardAdd/CardAdd";
import CardUser from "../../components/CardUser/CardUser";
import Button from "../../components/UI/Button/Button";
import { info, NEED_FIELD, personal, work, addTextBox } from "./constants";
import { useAddStudentMutation, useGetAllStudentQuery, useGetCombinationQuery } from "../../store/api/classApi";
import TextButton from "../../components/UI/TextButton/TextButton";
import ArrowIcon from '../../assets/icons/arrow.svg'
import AddIcon from '../../assets/icons/add.svg'
import { useRegistrationMutation } from "../../store/api/userApi";
import { useUser } from "../../context/userContext";

const Student = () => {
    const [sort, setSort] = useState({class: null, name: null});
    const [addSection, setAddSection] = useState(false);

    const {role} = useUser();
    const {debouncedSearchQuery, showSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const {data: classes} = useGetCombinationQuery();
    const {data: students, refetch} = useGetAllStudentQuery();
    const [addStudent] = useRegistrationMutation();
    const [addStudentInClass] = useAddStudentMutation();

    const {processedData: studentData} = useFormFilter(students, debouncedSearchQuery, sort);
    const {input, errors, handleInput, handlerError, clearAllErrors, clearInput } = useFormCreate();
    const {currentItem, hasNext, hasPrevios, nextPage, previosPage} = usePaggination({data: studentData, countOfPage: ['admin'].includes(role) ? 5 : 6});

    useEffect(() =>{
        setHeader('Students');
        setDescription('All students in one place');
        showSearch();
    }, [])

    const callbackSort = (name, value) => {
        setSort(prev => ({
            ...prev,
            [name]: value == null ? false : value == false ? true : null
        }))
    }
  
    const handleAdd = async () => {
        try{
            if(Object.keys(errors).length == 0 && Object.keys(input).length >= NEED_FIELD){
                const studentData = {
                    ...input,
                    role: 'student'
                }

                const student = await addStudent(studentData).unwrap();
                if(input.class) await addStudentInClass({id_student: student.id, id_class: input.class.id_class}).unwrap();
                await refetch();
                handleClose();
            }else{
                handlerError(new Error('All fields must be filled in!'));
                return;
            }
        }catch(error){
            handlerError(error);
        }
        
    }

    const handleClose = () => {
        setAddSection(false);
        clearAllErrors();
        clearInput();
    }

    const firstComponent = (
        <>
            <div className={st.setting}>
                <TextButton name={'Sort class'}>
                    <Button data={ArrowIcon} active={sort.class != null} callback={() => callbackSort('class', sort.class)} rotate={sort?.class}/>
                </TextButton>
                <TextButton name={'Sort name'}>
                    <Button data={ArrowIcon} active={sort.name != null} callback={() => callbackSort('name', sort.name)} rotate={sort?.name}/>
                </TextButton>
                {['admin'].includes(role) && <Button data={AddIcon} callback={() => setAddSection(true)}/>}
                <Button data={ArrowIcon} callback={hasPrevios ? previosPage : undefined} disabledStyle={!hasPrevios}/>
                <Button data={ArrowIcon} callback={hasNext ? nextPage : undefined} disabledStyle={!hasNext}/>
            </div>
            <div className={st.container}>
                {currentItem?.map(student => (
                    <CardUser key={student.id} user={student}/>
                ))}
                {['admin'].includes(role) && <CardAdd text={addTextBox} click={() => setAddSection(true)}/>}
            </div>
        </>
    );

    const secondComponent = (
        <CreateSection data={{info, personal, work}} form={{callback: handleInput, errors}} actions={{handleClose, handleAdd}} dataSelect={classes}/>
    );

    return (
        <AnimatedSwitch 
            condition={!addSection}
            firstComponent={firstComponent}
            secondComponent={secondComponent}
        /> 
    )
};

export default Student;
