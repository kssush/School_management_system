import React, { useEffect, useMemo, useState } from 'react';
import st from './Homework.module.scss';
import { useHeader } from '../../context/headerContext';
import { useMain } from '../../context/mainContext';
import Button from "../../components/UI/Button/Button";
import { days } from './constants';
import ArrowIcon from '../../assets/icons/arrow.svg'
import DoneIcon from '../../assets/icons/done.svg'
import { useAddReviewMutation, useGetLessonHomeworkQuery, useGetReviewMutation, useGetReviewQuery, useGetScheduleHomeworkQuery } from '../../store/api/magazineApi';
import {colorLessonContrast} from '../../components/TableSchedule/constants'

const tempData = new Date();
const year = tempData.getFullYear();
const month = tempData.getMonth() + 1;

const monday = new Date(tempData);
monday.setDate(tempData.getDate() - tempData.getDay() + (tempData.getDay() == 0 ? -6 : 1));

const sunday = new Date(monday);
sunday.setDate(sunday.getDate() + 6);

// const mondayString = [monday.getFullYear(),String(monday.getMonth() + 1).padStart(2, '0'), String(monday.getDate()).padStart(2, '0')].join('-');
const mondayString = monday.toLocaleDateString('en-CA');
const sundayString = sunday.toLocaleDateString('en-CA');

const defData = (month > 5 && month < 9) ? `${year}-05-01` : mondayString;
// а как летом?
const Homework = () => {
    const id_student = 11; ////// исправиль когда будет авторизации и тп

    const [day, setDay] = useState(days[0].value || 'Monday')
    const [date, setDate] = useState({currentMonday: defData, currentSunday: sundayString, currentDate: defData});
    const [lesson, setLesson] = useState([])
    const [grade, setGrade] = useState([])
    const [schedule, setSchedule] = useState([])
    const [dataHomework, setDataHomework] = useState([]);
    
    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const {data: schedules} = useGetScheduleHomeworkQuery(11);
    const {data: lessons} = useGetLessonHomeworkQuery({id: 11, date: date.currentMonday})
    const {data: review, refetch} = useGetReviewQuery(id_student, { refetchOnMountOrArgChange: true });
    const [addReviewed] = useAddReviewMutation();
    
    useEffect(() =>{
        setHeader('Magazine');
        setDescription('All lessons in one place');
        hideSearch();
    }, [])

    useEffect(() => {
        if(schedules) setSchedule(schedules[day] ?? [])
    }, [schedules, day])

    useEffect(() => {
        setGrade(lessons?.grade ?? [])
    }, [lessons, date.currentMonday])

    useEffect(() => {
        setLesson(lessons?.magazine?.[date.currentDate] ?? [])
        
    }, [lessons, date.currentDate])
    
    useEffect(() => {
        const tless = [...lesson];
        const temp = schedule.map(scd => {
            const lessIndex = tless.findIndex(les => les.id_project == scd.id_project);
            
            if (lessIndex !== -1) {
                const less = tless[lessIndex];
                const grd = grade.find(gr => gr.id_magazine == less.id);
                
                tless.splice(lessIndex, 1);
                
                return { ...scd, ...less, ...grd };
            } else {
                return scd;
            }
        });

        setDataHomework(temp);
    }, [schedule, lesson, grade]);

    const swipeWeek = (side) => {
        const cmDate = new Date(date.currentMonday);
        const cdDate = new Date(date.currentDate);
        const csDate = new Date(date.currentSunday);

        if(side == 'left'){
            cmDate.setDate(cmDate.getDate() - 7)
            cdDate.setDate(cdDate.getDate() - 7)
            csDate.setDate(csDate.getDate() - 7)
        }else{
            cmDate.setDate(cmDate.getDate() + 7)
            cdDate.setDate(cdDate.getDate() + 7)
            csDate.setDate(csDate.getDate() + 7)
        }

        const tcmDate = cmDate.toISOString().split('T')[0];
        const tcd = cdDate.toISOString().split('T')[0];
        const tsd = csDate.toISOString().split('T')[0];

        setDate({currentMonday: tcmDate, currentDate: tcd, currentSunday: tsd});
    }

    const handleSetDay = (count) => {
        const cmDate = new Date(date.currentMonday);
        const cdDate = new Date(date.currentDate);

        cdDate.setDate(cmDate.getDate() + count);

        const tcd = cdDate.toISOString().split('T')[0];

        setDay(days[count].value);
        setDate(prev => ({...prev, currentDate: tcd}));
    }
    
    const isMin = () => {
        const dt = new Date(date.currentMonday);
        
        if(dt.getDate() == 1 && dt.getMonth() + 1 == 9 || dt.getMonth() + 1 == 8) return true
        else return false;
    }

    const isMax = () => {
        const dt = new Date(date.currentSunday);
        
        if(dt.getDate() == 31 && dt.getMonth() + 1 == 5 || dt.getMonth() + 1 == 6) return true
        else return false;
    }

    const handleReviewed = async () => {
        await addReviewed(id_student);
        refetch();
    }

    return(
        <>
            <div className={st.setting}>
                {days?.map((d, index) => (
                    <Button key={index} data={d.name} active={d.value == day} callback={() => handleSetDay(index)} smallText={true}/>
                ))}
                <Button data={ArrowIcon} disabledStyle={isMin()} callback={!isMin() ? () => swipeWeek('left') : undefined}/>
                <Button data={ArrowIcon} disabledStyle={isMax()} callback={!isMax() ? () => swipeWeek('right') : undefined}/>
            </div>
            <div className={st.contant}>
                {dataHomework?.map((el, index) => (
                    <div key={el.id} className={st.homework}>
                        <div className={st.line} style={{backgroundColor: colorLessonContrast[index]}}></div>
                        <TextHomework text={el.name ? el.name : '-'} description={'subject'} />
                        <TextHomework text={el.lesson ? el.lesson : '-'} description={'lesson topic'} />
                        <TextHomework text={el.homework ? el.homework : '-'} description={'homework'} />
                        {el.pass && <div className={st.pass}>-</div>}
                        {el.remark && <div className={st.remark}>
                            !
                            <div className={st.remarkContainer}>
                                {el.remark}
                            </div>
                        </div>}
                        {el.mark && <div>{el.mark}</div>}
                       
                    </div>
                ))}
                {(!dataHomework || dataHomework?.length == 0) && <div className={st.noContant}>No lesson</div>}
            </div>
            <div className={st.helper}>
                <p>Select days:</p>
                <p>{date.currentMonday} - {date.currentSunday}</p>
                <div className={`${st.reviewed} ${review?.reviewed ? st.active : ''}`} onClick={handleReviewed}>
                    <p>Reviewed by</p>
                    <Button data={DoneIcon} callback={undefined} disabledStyle={review?.reviewed}/>
                </div>
            </div>
        </>
    )
};

export default Homework;


const TextHomework = ({text, description}) => {
    return(
        <div className={st.textHomework}>
            <p>{text}</p>
            <p>{description}</p>
        </div>
    )
}