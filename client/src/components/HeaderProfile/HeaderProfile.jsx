import React, { useEffect, useState } from "react";
import st from "./HeaderProfile.module.scss";
import { useUser } from "../../context/userContext";
import { Link, useLocation } from "react-router-dom";

const HeaderProfile = () => {
    const [active, setActive] = useState(false);

    const {user, id, role} = useUser();
    
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/authorization') {
            setActive(true);
        }
    }, [location.pathname]);

    if(!active) return null

    return(
        <Link to={`/profile/${role != 'admin' && id}`} className={st.profile}>
            <div className={st.icon}></div>
            <div className={st.profileText}>
                <p>{user?.surname ?? 'name'} {user?.name ?? 'surname'}data</p>
                <p>{user?.role ?? 'role'}</p>
            </div>
        </Link >
    )
};

export default HeaderProfile;
