import React from "react";
import {Routes, Route} from "react-router-dom"
import Schedule from "../../pages/Schedule/Schedule";
import TeacherSchedule from "../../pages/TeacherSchedule/TeacherSchedule";
import BellSchedule from "../../pages/BellSchedule/BellSchedule";

const AppRouter = () => {
    return(
        <Routes>
            <Route path="/" element={<Schedule />}></Route>
            <Route path="/teacherSchedule/:id_teacher" element={<TeacherSchedule />}></Route>
            <Route path="/bell" element={<BellSchedule />}></Route>
            <Route path="*" element={<Schedule />}></Route>
        </Routes>
    )
};

export default AppRouter;
