import React from "react";
import st from "./Aside.module.scss";
import { Link } from "react-router-dom";

const Aside = () => {
    return(
        <aside>
            <Link to="/">Schedule</Link>
            <Link to="/teacherSchedule/1">teacher</Link>
        </aside>
    )
};

export default Aside;
