import React, { useEffect, useState } from "react";
import st from "./Class.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import { useAddClassMutation, useAddStudentMutation, useClassUpMutation, useGetAllCombinationsQuery, useGetAllStudentQuery, useGetClassQuery, useGetCombinationQuery } from "../../store/api/classApi";
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import CardAdd from "../../components/CardAdd/CardAdd";
import CardUser from "../../components/CardUser/CardUser";
import Button from "../../components/UI/Button/Button";
import usePaggination from "../../hooks/usePaggination";
import useFormFilter from "../../hooks/useFormFilter";
import SelectName from "../../components/UI/SelectName/SelectName";
import ArrowIcon from '../../assets/icons/arrow.svg'
import AddIcon from '../../assets/icons/add.svg'
import DoneIcon from '../../assets/icons/done.svg'
import TextButton from "../../components/UI/TextButton/TextButton";
import { addTextBox } from "./constants";
import Modal from "../../components/UI/Modal/Modal";

const Class = () => {
    const [combination, setCombination] = useState(null);
    const [sort, setSort] = useState({name: null});
    const [openModalClass, setOpenModal] = useState({up: false, add: false, student: false});
    const [newCombination, setNewCombination] = useState(null); ////или как
    const [newStudent, setNewStudent] = useState(null);

    const {debouncedSearchQuery, hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const {data: combinations} = useGetCombinationQuery();
    const {data: students} = useGetClassQuery(combination?.id_class, {
        skip: !combination
    })
    const [classUp] = useClassUpMutation();
    const [classAdd] = useAddClassMutation();
    const [studentAdd] = useAddStudentMutation();

    const {processedData: studentData} = useFormFilter(students, debouncedSearchQuery, sort);
    const {currentItem, hasNext, hasPrevios, nextPage, previosPage} = usePaggination({data: studentData, countOfPage: 5});

    useEffect(() =>{
        setHeader('Class');
        setDescription('All classes in one place');
        hideSearch();
    }, [])

    const callbackSort = (name, value) => {
        setSort(prev => ({
            ...prev,
            [name]: value == null ? false : value == false ? true : null
        }))
    }

    const handleClassUp = async () => {
        await classUp();
        handleCloseModal();
        window.location.reload();
    }

    const handleAddClass = async () => {
        await classAdd({id_combination: newCombination});
        handleCloseModal();
    }

    const handleAddStudent = async() => {
        if(!combination.id_class || !newStudent){
            alert('The student was not selected!');
            return;
        }

        await studentAdd({id_class: combination.id_class, id_student: newStudent});
        handleCloseModal();
    }

    const handleOpenModal = (name) => setOpenModal(prev => ({...prev, [name]: true}))
    const handleCloseModal = () => setOpenModal({up: false, add: false, student: false})
    
    const firstComponent = (
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombination} defaultValue={combinations?.find(cb => cb.id == combination)?.name}/>
                <TextButton name={'Sort name'}>
                    <Button data={ArrowIcon} active={sort.name != null} callback={() => callbackSort('name', sort.name)} rotate={sort?.name}/>
                </TextButton>
                <Button data={DoneIcon} callback={() => handleOpenModal('up')}/>
                <Button data={AddIcon} callback={() => handleOpenModal('add')}/>
                <Button data={ArrowIcon} callback={hasPrevios ? previosPage : undefined} disabledStyle={!hasPrevios}/>
                <Button data={ArrowIcon} callback={hasNext ? nextPage : undefined} disabledStyle={!hasNext}/>
            </div>
            <div className={st.container}>
                {currentItem?.map(student => (
                    <CardUser key={student.id} user={student} isClass={true}/>
                ))}
                {combination && <CardAdd text={addTextBox} click={() => handleOpenModal('student')}/>}
                {!combination && <div className={st.noneElement}>Select class</div>}
            </div>
        </>
    );

    return (
        <>
            <AnimatedSwitch
                condition={true}
                firstComponent={firstComponent}
            /> 
            <Modal
                active={openModalClass.up || openModalClass.add || openModalClass.student}
                callback={handleCloseModal} 
                textHeader={openModalClass.add ? 'What class combination do you want to use?' :  openModalClass.up ?  'Do you want to transfer to a higher grade?' : 'Add student'} 
                textConfirm={openModalClass.up ? 'Up' : 'Add'} 
                textClose={'Close'}
                onConfirm={openModalClass.add ? handleAddClass : openModalClass.up ? handleClassUp : handleAddStudent}
                onClose={handleCloseModal}
            >
                {openModalClass.add && (
                    <ModalAddClass callback={setNewCombination}/>
                )}
                {openModalClass.student && (
                    <ModalAddStudent callback={setNewStudent}/>
                )}
            </Modal>
        </>   
    )
};

export default Class;


const ModalAddClass = ({callback}) => {
    const [value, setValue] = useState(null);
    const {data: combinations} = useGetAllCombinationsQuery();

    useEffect(() => {
        if(value) callback(value.id)
    }, [value])

    return(
        <div className={st.modalAdd}> 
            <SelectName name={'Class'} data={combinations} callback={setValue}/>
            {value && (<div>
                <p>Class with combination:</p>
                <p>{value.name}</p>
            </div>)}
        </div>
    )
}


const ModalAddStudent = ({callback}) => {
    const [value, setValue] = useState(null);
    const {data: students} = useGetAllStudentQuery(true);

    useEffect(() => {
        if(value) callback(value.id)
    }, [value])

    return(
        <div className={st.modalStudent}> 
            {students?.map(student => (
                <div className={`${st.studentBox} ${value?.id == student.id ? st.active : ''}`} key={student.id} onClick={() => setValue(student)}>
                    <p>{student.surname}</p>
                    <p>{student.name} {student.patronymic}</p> 
                </div>
            ))}
            {students && students.length == 0 && <p className={st.withoutClass}>No student without class</p>}
        </div>
    )
}