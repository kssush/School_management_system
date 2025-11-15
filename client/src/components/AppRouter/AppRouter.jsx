import React from "react";
import {Routes, Route} from "react-router-dom"
import Schedule from "../../pages/Schedule/Schedule";
import { pages } from "../../servises/router";
import { useUser } from "../../context/userContext";


const AppRouter = () => {
    const {role} = useUser();
    console.log(role)
    return(
        <Routes>
            {pages['basic'].map(item => (
                <Route path={item.page} element={<item.component />} key={item.page}></Route>
            ))}
            {pages[role].map(item => (
                <Route path={item.page} element={<item.component />} key={item.page}></Route>
            ))}
            <Route path="*" element={<Schedule />}></Route>
        </Routes>
    )
};

export default AppRouter;
