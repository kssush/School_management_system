import React, { useEffect, useState } from "react";
import st from "./Analytics.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import MagazineTable from "../../components/MagazineUI/MagazineTable/MagazineTable";
import SelectName from "../../components/UI/SelectName/SelectName";
import Button from "../../components/UI/Button/Button";
import RemarkIcon from '../../assets/icons/remark.svg'
import { useGetSubjectForClassQuery } from "../../store/api/scheduleApi";
import { useGetClassAnalyticsQuery, useGetCombinationQuery } from "../../store/api/classApi";
import { useGetMagazineQuery, useGetPerformanceQuery } from "../../store/api/magazineApi";
import Modal from "../../components/UI/Modal/Modal";

const Analytics = () => {
    const [combination, setCombination] = useState(null);
    const [subject, setSubject] = useState(null)
    const [student, setStudent] = useState(null);
    const [viewSetting, ] = useState({mark: true, pass: true});
    const [setting, ] = useState({modal: false, analytics: true});
    const [countProb, setCountProb] = useState({bad: 0, middle: 0}); 
    const [openModal, setOpenModal] = useState(false);
    const [magazine, setMagazine] = useState(null);

    const {data: combinations} = useGetCombinationQuery();
    const {data: subjects} = useGetSubjectForClassQuery(combination?.id, {
        skip: !combination
    });
     const {data: students} = useGetClassAnalyticsQuery(combination?.id_class, {
        skip: !combination
    });
    const {data: magazines} = useGetMagazineQuery({
        id_class: combination?.id_class,
        id_project: subject?.id,
        date: new Date().toLocaleDateString('en-CA')
    }, {
        skip: !combination || !subject
    })
    const {data: performances} = useGetPerformanceQuery({
        id_class: combination?.id_class,
        id_project: subject?.id,
        date: new Date().toLocaleDateString('en-CA')
    }, {
        skip: !combination || !subject
    });

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    useEffect(() =>{
        setHeader('Analytics');
        setDescription('All analytics in one place');
        hideSearch();
    }, [])

    useEffect(() => {
        setMagazine(magazines);
    }, [magazines])

    useEffect(() => {
        setSubject(null);
        setMagazine(null);
        setCountProb({bad: 0, middle: 0});
    }, [combination])

    useEffect(() => {
        if(students && subject){
            setStudent(students?.[subject?.id])

            const temp = {bad: 0, middle: 0};

            students?.[subject?.id].forEach(item => {
                if(item.prob) temp[item.prob] += 1; 
            })
            setCountProb(temp);
        }
    }, [students, subject])

    return (
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombination} />
                <SelectName name={'Subject'} data={subjects} callback={setSubject} />
                <Button data={RemarkIcon} callback={() => setOpenModal(true)}/>
            </div>
            <MagazineTable students={student} magazines={magazine} performances={performances} setting={setting} viewSetting={viewSetting}/>
            <Modal active={openModal} callback={setOpenModal} textHeader={'Statistics'} textConfirm={'Confirm'} textClose={'Close'} onConfirm={() => setOpenModal(false)} onClose={() => setOpenModal(false)}>
                <div className={st.statistics}>
                    <p>Students who may not be able to master the program:</p>
                    <p>{countProb.middle}</p>  
                    <p>Students who fail to master the program:</p>
                    <p>{countProb.bad}</p>  
                </div>
            </Modal>
        </>
        
    )
};

export default Analytics;