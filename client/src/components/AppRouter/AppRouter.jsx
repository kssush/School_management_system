import React from "react";
import {Routes, Route} from "react-router-dom"
import Schedule from "../../pages/Schedule/Schedule";
import TeacherSchedule from "../../pages/TeacherSchedule/TeacherSchedule";
import BellSchedule from "../../pages/BellSchedule/BellSchedule";
import Teacher from "../../pages/Teacher/Teacher";
import Family from "../../pages/Family/Family";
import Profile from "../../pages/Profile/Profile";
import Student from "../../pages/Student/Student";
import Class from "../../pages/Class/Class";
import Magazine from "../../pages/Magazine/Magazine";
import Homework from "../../pages/Homework/Homework";
import Analytics from "../../pages/Analytics/Analytics";
import Authorization from "../../pages/Authorization/Authorization";

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
            <Route path="/class" element={<Class />}></Route>
            <Route path="/magazine" element={<Magazine />}></Route>
            <Route path="/homework" element={<Homework />}></Route>
            <Route path="/analytics" element={<Analytics />}></Route>
            <Route path="*" element={<Schedule />}></Route>
        </Routes>
    )
};

export default AppRouter;
