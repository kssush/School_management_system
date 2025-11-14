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

const Analytics = () => {
    const [combination, setCombination] = useState(null);
    const [subject, setSubject] = useState(null)
    const [viewSetting, ] = useState({mark: true, pass: true});
    const [setting, ] = useState({modal: false, analytics: true});

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

    return (
        <>
            <div className={st.setting}>
                <SelectName name={'Class'} data={combinations} callback={setCombination} />
                <SelectName name={'Subject'} data={subjects} callback={setSubject} />
                <Button data={RemarkIcon} callback={() => console.log('sdfsdf')}/>
            </div>
            <MagazineTable students={students?.[subject?.id]} magazines={magazines} performances={performances} setting={setting} viewSetting={viewSetting}/>
        </>
        
    )
};

export default Analytics;
