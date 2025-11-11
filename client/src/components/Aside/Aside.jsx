import React from "react";
import st from "./Aside.module.scss";
import { Link } from "react-router-dom";

const Aside = () => {
    return(
        <aside>
            <Link to="/">Schedule</Link>
            <Link to="/bell">Bell Schedule</Link>
            <Link to="/teacher">Teacher</Link>
            <Link to="/student">Student</Link>
            <Link to="/class">Class</Link>
            <Link to="/magazine">Magazine</Link>
        </aside>
    )
};

export default Aside;