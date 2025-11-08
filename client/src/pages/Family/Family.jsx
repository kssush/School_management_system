import React, { useEffect, useState } from "react";
import st from "./Family.module.scss";
import { useMain } from "../../context/mainContext";
import { useHeader } from "../../context/headerContext";
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import CreateSection from "../../components/CreateSection/CreateSection";
import TextButton from "../../components/UI/TextButton/TextButton";
import Button from "../../components/UI/Button/Button";
import ChangeIcon from '../../assets/icons/change.svg';
import BoxProfile from "../../components/BoxProfile/BoxProfile";
import CardAdd from "../../components/CardAdd/CardAdd";
import { useGetFamilyQuery, useLazyGetFamilyLazyQuery, useUpdateParentMutation, useUpdateUserMutation } from "../../store/api/userApi";
import { useParams } from "react-router-dom";
import {addTextBox_mam, addTextBox_dad, info, work, work_student, NEED_FIELD, personal, NEED_FIELD_UPDATE} from './constants'
import useFormCreate from "../../hooks/useFormCreate";
import { useAddStudentMutation, useGetCombinationQuery } from "../../store/api/classApi";
const Family = () => {
    const {id_student} = useParams();

    const [role, setRole] = useState('student');
    const [activeSection, setActiveSection] = useState('view'); //'change' | 'add'
    const [infoData, setInfoData] = useState({personal: [], professional: []});

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();
    
    const {data: classes} = useGetCombinationQuery();
    const [fetchFamily, { data: family }] = useLazyGetFamilyLazyQuery();
    const [updateParent] = useUpdateParentMutation();
    const [updateUser] = useUpdateUserMutation();
    const [addStudent] = useAddStudentMutation();

    const {input, errors, handleInput, handlerError, clearAllErrors, clearInput } = useFormCreate();
    console.log(classes)
    useEffect(() =>{
        setHeader('Family');
        setDescription('All family in one place');
        hideSearch();

        fetchFamily({ id: id_student, role: 'student' });
    }, [])

    useEffect(() => {
        if (!family?.[role]) return;

        const current = family[role];

        const personalData = [
            { name: 'full name', value: `${current.surname} ${current.name} ${current.patronymic}` || '-' },
            { name: 'telephone', value: current.telephone || '-' },
            { name: 'address', value: current.address || '-' },
            { name: 'birthday', value: current.birthday || '-' },
        ];

        const professionalData = [
            role !== 'student' && { name: 'place of work', value: current.work || '-' },
            role !== 'student' && { name: 'post', value: current.post || '-' },
            role === 'student' && { name: 'class', value: classes.find(el => el.id_class == current.student_composition[0]?.id_class)?.name || '-' },
            { name: 'email', value: current.email || '-' }
        ].filter(Boolean);

        setInfoData({
            personal: personalData,
            professional: professionalData
        });
    }, [family, role, classes]);

    const handleOpenChange = () => setActiveSection('change');
    const handleOpenAdd = () => setActiveSection('add');

    const handleAdd = () => {
        
    }

    const handleUpdate = async () => {
        try{
            if(Object.keys(errors).length == 0 && Object.keys(input).length >= NEED_FIELD_UPDATE){
                const familyData = {
                    ...input,   
                    id_class: input?.class?.id_class,
                    role: role
                }
                
                await updateUser({id: family[role].id, ...familyData}).unwrap();

                if(role != 'student'){
                    await updateParent({id: family[role].id, ...familyData}).unwrap();
                } else {
                    
                    if(familyData.id_class) await addStudent({id_student: family[role].id, id_class: familyData.id_class}).unwrap();
                }

                handleClose();
            }else{
                handlerError(new Error('At least one field must be filled in!'));
                return;
            }
        }catch(error){
            handlerError(error);
        }
    }

    const handleClose = () => {
        setActiveSection('view');
        clearAllErrors();
        clearInput();
    }

    const firstComponent = (
        <>
            <div className={st.setting}>
                <TextButton name={'Family'}>
                    <Button data={'mam'} active={role == 'mam'} callback={() => setRole('mam')} fitSize={true}/>
                    <Button data={'dad'} active={role == 'dad'} callback={() => setRole('dad')} fitSize={true}/>
                    <Button data={'student'} active={role == 'student'} callback={() => setRole('student')} fitSize={true}/>
                </TextButton>
                <Button data={ChangeIcon} active={activeSection == 'change'} callback={family?.[role] != null ? handleOpenChange : undefined} disabledStyle={family?.[role] == null}/>
            </div>  
            {family?.[role]?.id != undefined ? <BoxProfile info={infoData} image={family?.[role]?.image}/> :
                <CardAdd text={role == 'mam' ? addTextBox_mam : addTextBox_dad} click={handleOpenAdd}/>
            }
        </>
    );

    const secondComponentChange = (
        <CreateSection data={{info, work: role == 'student' ? work_student : work}} form={{callback: handleInput, errors}} actions={{handleClose, handleAdd: handleUpdate}} dataSelect={role == 'student' ? classes : undefined}/>
    );

    const secondComponentAdd= (
        <CreateSection data={{info, personal, work}} form={{callback: handleInput, errors}} actions={{handleClose, handleAdd}}/>
    );

    return (
        <AnimatedSwitch
            condition={activeSection == 'view'}
            firstComponent={firstComponent}
            secondComponent={activeSection == 'add' ? secondComponentAdd : secondComponentChange}
        /> 
    )
};

export default Family;
