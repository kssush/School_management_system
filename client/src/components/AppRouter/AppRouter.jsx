import React from "react";
import {Routes, Route} from "react-router-dom"
import Schedule from "../../pages/Schedule/Schedule";

const AppRouter = () => {
    return(
        <Routes>
            <Route path="/" element={<Schedule />}></Route>
            <Route path="/asd" element={<Schedule />}></Route>
            <Route path="*" element={<Schedule />}></Route>
        </Routes>
    )
};

export default AppRouter;
