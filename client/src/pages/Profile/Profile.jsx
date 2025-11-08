import React, { useEffect, useState } from "react";
import st from "./Profile.module.scss";
import { useParams } from "react-router-dom";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import Button from "../../components/UI/Button/Button";
import ChangeIcon from "../../assets/icons/change.svg"
import { useGetTeacherQuery, useUpdateTeacherMutation } from "../../store/api/userApi";
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import CreateSection from "../../components/CreateSection/CreateSection";
import useFormCreate from "../../hooks/useFormCreate";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { info, NEED_FIELD, work } from "./constants";
import BoxProfile from "../../components/BoxProfile/BoxProfile";

const Profile = () => {
    const { id_teacher } = useParams();

    const [infoData, setInfoData] = useState({personal: [], professional: []});
    const [openChange, setOpenChange] = useState(false);

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const {data: classes} = useGetCombinationQuery();
    const {data: teacher} = useGetTeacherQuery(id_teacher);
    const [updateTeacher] = useUpdateTeacherMutation();

    useEffect(() =>{
        hideSearch();
        setHeader('Profile');
        setDescription('All personal in one place');
    }, [])

    const {input, errors, handleInput, handlerError, clearAllErrors, clearInput } = useFormCreate();

    useEffect(() => {
        if (!teacher) return;

        const personalData = [
            { name: 'full name', value: `${teacher.surname} ${teacher.name} ${teacher.patronymic}` || '-' },
            { name: 'telephone', value: teacher.telephone || '-' },
            { name: 'address', value: teacher.address || '-' },
            { name: 'birthday', value: teacher.birthday || '-' },
        ];

        const professionalData = [
            { name: 'class', value: teacher.class || '-' },
            { name: 'email', value: teacher.email || '-' }
        ];

        setInfoData({
            personal: personalData,
            professional: professionalData
        });
    }, [teacher]);

    const handleAdd = async () => {
        try{
            if(Object.keys(errors).length == 0 && Object.keys(input).length >= NEED_FIELD){
                const teacherData = {
                    ...input,   
                    id_class: input?.class?.id_class,
                    role: 'teacher'
                }

                await updateTeacher({id: id_teacher, teacherData}).unwrap();
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
        setOpenChange(false);
        clearAllErrors();
        clearInput();
    }

    
    const firstComponent = (
        <>
            <div className={st.setting}>
                <Button data={ChangeIcon} callback={() => setOpenChange(true)}/>
            </div>
            <BoxProfile info={infoData} image={teacher?.image}/>
        </>
    )

    const secondComponent = (
        <CreateSection data={{info, work}} form={{callback: handleInput, errors}} actions={{handleClose, handleAdd}} dataSelect={classes} update={'Update'}/>
    );

    return (
        <AnimatedSwitch
            condition={!openChange}
            firstComponent={firstComponent}
            secondComponent={secondComponent}
        /> 
    )
};

export default Profile;


