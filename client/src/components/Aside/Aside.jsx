import React, { useEffect, useMemo, useState } from "react";
import st from "./Aside.module.scss";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/userApi";
import { useUser } from "../../context/userContext";
import { pages } from "../../servises/router";

const topBegin = -0.9375;

const Aside = () => {
    const basic = pages['basic'].filter(item => !item.page.includes('/:id'));

    const [top, setTop] = useState(topBegin);
    const [active, setActive] = useState(basic[0].name);

    const {role, setSkip} = useUser();

    const [logout] = useLogoutMutation();

    const handleSetTopActive = (index, name, more = false) => {
        const total = index + (more && basic.length)

        setTop(topBegin + total * 3.75); //rem
        setActive(name);
    }

    const handleLogout = async () => {
        setSkip(true);

        localStorage.removeItem('accessToken');
        await logout();

        window.location.reload();
    }

    return(
        <aside>
            <div className={`${st.selectPage} ${!active ? st.noActive : ''}`} style={{top: `${top}rem`}}></div>
            {basic.map((item, index) => (
                <AsideItem icon={item.icon} page={item.page} name={item.name} callback={() => handleSetTopActive(index, item.name)} active={active} key={item.name}/>
            ))}
            {pages[role].map((item, index) => (
                <AsideItem icon={item.icon} page={item.page} name={item.name} callback={() => handleSetTopActive(index, item.name, true)} active={active} key={item.name}/>
            ))}
            <button className={st.links} onClick={handleLogout}>Log out</button>
        </aside>
    )
};

export default Aside;

const AsideItem = ({icon, page, name, callback, active}) => {
    return(
        <div className={`${st.asideItem} ${name == active ? st.active : ''}`}>
            <img src={icon} alt="ic" />
            <Link to={page} key={name} onClick={callback}>{name}</Link>
        </div>
    )
}