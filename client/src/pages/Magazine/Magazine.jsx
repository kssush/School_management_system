import React, { useEffect, useState } from "react";
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
import {useGetMagazineQuery, useGetPerformanceQuery, useResetReviewMutation } from "../../store/api/magazineApi";
import AddLessonModal from "../../components/MagazineUI/AddLessonModal/AddLessonModal";
import MagazineTable from "../../components/MagazineUI/MagazineTable/MagazineTable";
import Modal from "../../components/UI/Modal/Modal";
import { useUser } from "../../context/userContext";

const tempData = new Date();
const year = tempData.getFullYear();
const month = tempData.getMonth() + 1;

const defData = (month > 5 && month < 9) ? `${year}-05-01` : tempData.toISOString().split('T')[0];

const Magazine = () => {
    const [date, setDate] = useState(defData);
    const [combination, setCombination] = useState(null);
    const [subject, setSubject] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [resetReview, setResetReview] = useState(false);
    const [viewSetting, setViewSetting] = useState({mark: true, remark: false, pass: false, reviewed: false});
    const [setting, ] = useState({modal: true, analytics: true});

    const {role} = useUser();
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

    const [resetReviewed] = useResetReviewMutation();

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

    const handleResetReviewed = async () => {
        await resetReviewed(combination.id_class);
        setResetReview(false);
    }

    return (
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombination} />
                <SelectName name={'Subject'} data={subjects} callback={setSubject} />
                {['teacher', 'admin'].includes(role) ? <Button data={AddIcon} callback={handleOpenModal}/> : <span></span>}
                <Button data={AbsenceIcon} active={viewSetting.pass} callback={() => handleToggleViewSetting('pass')}/>
                <Button data={RemarkIcon} active={viewSetting.remark} callback={() => handleToggleViewSetting('remark')}/>
                <Button data={'5'} active={viewSetting.mark} callback={() => handleToggleViewSetting('mark')}/>
                <Button data={DoneIcon} active={viewSetting.reviewed} callback={() => handleToggleViewSetting('reviewed')}/>
                <Button data={ArrowIcon} callback={!isMin() ? () => swipeMonth('left') : undefined} disabledStyle={isMin()}/>
                <Button data={ArrowIcon} callback={!isMax() ? () => swipeMonth('right') : undefined} disabledStyle={isMax()}/>
            </div>
            <MagazineTable students={students} magazines={magazines} performances={performances} setting={setting} viewSetting={viewSetting}/> 
            <div className={st.helper}>   
                <p>Select month:</p>
                <p>{new Date(date).toLocaleString('en-EN', { month: 'long' })}</p>
                <p>Use the touchpad or scroll / shift + scroll </p>
                <button onClick={() => setResetReview(true)}>reset reviewed</button>
            </div>
            {['teacher', 'admin'].includes(role) && <AddLessonModal active={openModal} callback={setOpenModal} id_class={combination?.id_class} id_project={subject?.id} defaultCallback={defaulDate}/>}
            {['teacher', 'admin'].includes(role) && <Modal active={resetReview} callback={setResetReview} textHeader={'Reset reviewed'} textConfirm={'Reset'} textClose={'Close'} onConfirm={handleResetReviewed} onClose={() => setResetReview(false)} />}
        </>  
    );
};

export default Magazine;

// classBag={{id_class: combination?.id_class}}}





