import { useState } from "react";
import PerformanceModal from "../PerformanceModal/PerformanceModal";
import AddLessonModal from "../AddLessonModal/AddLessonModal";
import st from "./MagazineTable.module.scss";
import { useUser } from "../../../context/userContext";

const MagazineTable = ({ students, magazines, performances, viewSetting, setting, children }) => {
    const [openModal, setOpenModal] = useState({updateLesson: false, performance: false});
    const [lessonId, setLessonId] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [performanceData, setPerformanceData] = useState({id: null, remark: null});
    
    const {role} = useUser();

    const handleOpenModal = (name) =>{
        setOpenModal(prev => ({
            ...prev,
            [name]: true
        }))
    }
    const handleCloseModal = () => setOpenModal({updateLesson: false, performance: false})

    const handleClick = (event) => {
        const studentId = event.target.dataset.studentId;
        const lessonId = event.currentTarget.dataset.lessonId
        const performanceId = event.target.dataset.performId;
        const performanceRemark = event.target.dataset.performRemark;

        setLessonId(lessonId)
        if(!studentId) {
            handleOpenModal('updateLesson');
        }else{
            setStudentId(studentId)
            setPerformanceData(prev => ({...prev, id: performanceId ? performanceId : null}));
            setPerformanceData(prev => ({...prev, remark: performanceRemark ? performanceRemark : null}));
 
            handleOpenModal('performance')
        }
    }

    return ( 
        <>
            <div className={st.magazine}>
                {students ?
                    (
                        <div className={st.column}>
                            <div className={st.header}>
                                <p>№</p>
                                <p>Surname Name</p>
                            </div>
                            {students?.map((student, index) => (
                                <div key={student.id}>
                                    <p>{index + 1}</p>
                                    <p>{student.surname} {student.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={st.noClass}>Select class</div>
                    )
                }          
                <div className={`${st.box} ${!students || students?.length == 0 ? st.noStudent : (magazines ? (magazines?.length == 0 ? st.noMagazine : '') : st.noSub)}`}>              
                    {students && viewSetting.reviewed && (
                        <div className={`${st.column1} ${st.reviewedBorder}`} key={'reviewed'} >   
                            <div className={st.header}>
                                reviewed
                            </div>               
                            {students?.map((student, index) => (
                                <div key={index}
                                    className={`${student.reviewed ? st.reviewedYes : st.reviewedNo}`}
                                >
                                    {student.reviewed ? '+' : '-'}
                                </div>
                            ))}
                        </div>
                    )}
                    {(magazines && magazines.length > 0 ) ? (
                        magazines?.map((lessons, index) => (
                            lessons?.lessons?.map((lesson, lessonIndex) => {
                                const performance = performances?.[lesson.id]

                                return(
                                    <div className={st.column1} key={lesson.id} data-lesson-id={lesson.id} onClick={handleClick}>   
                                        <div className={st.header} onClick={handleClick}>
                                            {lessons.formatDate}
                                            {lesson.lesson && (
                                                <div className={st.lessonBox}>
                                                    <p>{lesson.lesson}</p>
                                                    <p>lesson</p>
                                                    <p>{lesson.homework}</p>
                                                    {lesson.homework && <p>homework</p> }
                                                </div>  
                                            )}
                                        </div>               
                                        {students?.map((student, index) => {
                                            const perform = performance && performance.find(perf => perf.id_student == student.id)
                                            
                                            if(perform){
                                                return(
                                                    <div
                                                        key={student.id}
                                                        data-student-id={student.id}
                                                        data-perform-id={perform.id}
                                                        data-perform-remark = {perform.remark}
                                                        className={`${viewSetting.remark && perform.remark ? st.remark : ''} ${viewSetting.pass && perform.pass == true ? st.pass : ''} ${setting.analytics && student.prob == 'bad' ? st.bad : student.prob == 'middle' ? st.middle : ''}`}
                                                    > 
                                                        {viewSetting.remark && perform.remark && <div className={st.remarkBox}>
                                                            <p>{perform.remark}</p>
                                                            <p>remark</p>
                                                        </div>  }
                                                        {viewSetting.pass && perform.pass ? '-' : ''}
                                                        {!perform.pass && <>{viewSetting.mark && perform.mark} {viewSetting.remark && perform.remark ? '!' : null}</> }
                                                    </div> 
                                                )
                                            }
                                            return <div key={student.id} data-student-id={student.id} className={`${student.prob == 'bad' ? st.bad : student.prob == 'middle' ? st.middle : ''}`}/>
                                        })}
                                    </div>
                                )
                            })
                        ))
                    )  : (
                        <div className={students ? st.noSubject : st.noElement}>{magazines ? 'No lesson' : 'Select subject'}</div> 
                    )}         
                </div>
            </div>
            {['teacher', 'admin'].includes(role) && setting.modal && <AddLessonModal active={openModal.updateLesson} callback={handleCloseModal} id_lesson={lessonId}/>}
            {['teacher', 'admin'].includes(role) && setting.modal && <PerformanceModal active={openModal.performance} callback={handleCloseModal} id_magazine={lessonId} id_student={studentId} id_performance={performanceData.id} remark={performanceData.remark}/>}
        </>
    )
}

export default MagazineTable;