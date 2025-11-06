import React, { useEffect, useState } from "react";
import st from "./Teacher.module.scss";
import { useMain } from "../../context/mainContext";
import TextButton from "../../components/UI/TextButton/TextButton";
import Button from "../../components/UI/Button/Button";
import ArrowIcon from '../../assets/icons/arrow.svg'
import AddIcon from '../../assets/icons/add.svg'
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import useFormCreate from "../../hooks/useFormCreate";
import CreateSection from "../../components/CreateSection/CreateSection";
import { info, NEED_FIELD, personal, work } from "./constants";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { useGetTeachersQuery, useRegistrationMutation } from "../../store/api/userApi";
import CardUser from "../../components/CardUser/CardUser";
import { useHeader } from "../../context/headerContext";
import useFormFilter from "../../hooks/useFormFilter";
import usePaggination from "../../hooks/usePaggination";

const a = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]


const Teacher = () => {
    const [sort, setSort] = useState({class: null, name: null});
    const [addSection, setAddSection] = useState(false);

    const {debouncedSearchQuery, showSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const {data: classes} = useGetCombinationQuery();
    const {data: teachers, refetch } = useGetTeachersQuery();
    const {processedData: teacherData} = useFormFilter(teachers, debouncedSearchQuery, sort);
    const [addTeacher] = useRegistrationMutation();

    const {input, errors, handleInput, handlerError, clearAllErrors, clearInput } = useFormCreate();
    const {currentItem, hasNext, hasPrevios, nextPage, previosPage} = usePaggination({data: teacherData, countOfPage: 1});

    
    console.log('c', currentItem)

    useEffect(() =>{
        setHeader('Teachers');
        setDescription('All teachers in one place');
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
                const teacherData = {
                    ...input,
                    role: 'teacher'
                }

                await addTeacher(teacherData).unwrap();
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
                <Button data={AddIcon} callback={() => console.log('asd')}/>
                <Button data={ArrowIcon} callback={hasPrevios ? previosPage : undefined}/>
                <Button data={ArrowIcon} callback={hasNext ? nextPage : undefined}/>
            </div>
            <div>
               {currentItem?.map(teacher => (
                    <CardUser key={teacher.id} user={teacher}/>
                ))}
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

export default Teacher;