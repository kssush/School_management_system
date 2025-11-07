import React from "react";
import {Routes, Route} from "react-router-dom"
import Schedule from "../../pages/Schedule/Schedule";
import TeacherSchedule from "../../pages/TeacherSchedule/TeacherSchedule";
import BellSchedule from "../../pages/BellSchedule/BellSchedule";
import Teacher from "../../pages/Teacher/Teacher";
import Family from "../../pages/Family/Family";
import Profile from "../../pages/Profile/Profile";
import Student from "../../pages/Student/Student";

const AppRouter = () => {
    return(
        <Routes>
            <Route path="/" element={<Schedule />}></Route>
            <Route path="/teacherSchedule/:id_teacher" element={<TeacherSchedule />}></Route>
            <Route path="/bell" element={<BellSchedule />}></Route>
            <Route path="/teacher" element={<Teacher />}></Route>
            <Route path="/student" element={<Student />}></Route>
            <Route path="/family/:id_student" element={<Family />}></Route>
            <Route path="/profile/:id_teacher" element={<Profile />}></Route>
            <Route path="*" element={<Schedule />}></Route>
        </Routes>
    )
};

export default AppRouter;
