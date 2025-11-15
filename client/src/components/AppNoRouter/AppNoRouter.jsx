import React, { useEffect } from "react";
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom"
import Authorization from "../../pages/Authorization/Authorization";

const AppNoRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname !== '/authorization') {
            navigate('/authorization', { replace: true });
        }
    }, [location.pathname, navigate]);

    return(
        <Routes>
            <Route path="/authorization" element={<Authorization />} />
        </Routes>
    )
};

export default AppNoRouter;