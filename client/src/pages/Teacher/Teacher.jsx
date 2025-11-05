import React, { useEffect, useState } from "react";
import st from "./Teacher.module.scss";
import { useMain } from "../../context/mainContext";
import TextButton from "../../components/UI/TextButton/TextButton";
import Button from "../../components/UI/Button/Button";
import ArrowIcon from '../../assets/icons/arrow.svg'
import AddIcon from '../../assets/icons/add.svg'
import MoreIcon from '../../assets/icons/more.svg'
import AnimatedSwitch from "../../components/UI/AnimatedSwitch/AnimatedSwitch";
import useFormCreate from "../../hooks/useFormCreate";
import CreateSection from "../../components/CreateSection/CreateSection";
import { info, personal, work } from "./constants";
import { useGetCombinationQuery } from "../../store/api/classApi";
import { useGetTeachersQuery } from "../../store/api/userApi";

import ClassIcon from '../../assets/icons/class.svg'
import TelephoneIcon from '../../assets/icons/telephone.svg'

const Teacher = () => {
    const [sort, setSort] = useState({class: null, name: null});
    const [addSection, setAddSection] = useState(false);

    const {setHeader, setDescription} = useMain();
    const { input, errors, handleInput, clearAllErrors, clearInput } = useFormCreate();

    const {data: classes} = useGetCombinationQuery();
    const {data: teachers} = useGetTeachersQuery();

    useEffect(() =>{
        setHeader('Teachers');
        setDescription('All teachers in one place');
    }, [])

    const callbackSort = (name, value) => {
        setSort(prev => ({
            ...prev,
            [name]: value == null ? false : value == false ? true : null
        }))
    }

    const handleAdd = () => {
        if(Object.keys(errors).length == 0){
            console.log('нет ошибок')
        }else{
            console.log('есть ошибок')
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
                    <Button data={ArrowIcon} active={sort.class != null} callback={() => callbackSort('class', sort?.class)} rotate={sort?.class}/>
                </TextButton>
                <TextButton name={'Sort name'}>
                    <Button data={ArrowIcon} active={sort.name != null} callback={() => callbackSort('name', sort?.name)} rotate={sort?.name}/>
                </TextButton>
                <Button data={AddIcon} callback={() => setAddSection(true)}/>
                <Button data={ArrowIcon} callback={() => setAddSection(true)}/>
                <Button data={ArrowIcon} callback={() => setAddSection(true)}/>
            </div>
            <div>
                {teachers?.map(tc => (
                    <CardUser user={tc}/>
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



const CardUser = ({user}) => {
    return(
        <div className={st.cardUser}>
            <div className={st.card}>
                <img src={MoreIcon} alt="..." />
                <div className={st.person}>
                    <div className={st.icon}></div>
                    <div className={st.text}>
                        <p>{user.surname}</p>
                        <p>{user.name} {user.patronymic ?? ''}</p>
                    </div>
                </div>
                <div className={st.line}></div>
                <div className={st.info}>
                    <div>
                        <img src={TelephoneIcon} alt="ic" />
                        <div className={st.contact}>
                            <p>{user.telephone}</p>
                            <p>telephone</p>
                        </div>
                    </div>
                    <div>
                        <img src={ClassIcon} alt="ic" />
                        <div className={st.contact}>
                            <p>-</p>
                            <p>class</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}