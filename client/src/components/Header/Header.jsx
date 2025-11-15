import React from "react";
import st from "./Header.module.scss";
import { useHeader } from "../../context/headerContext";
import Search from "../UI/Search/Search";
import { Link } from "react-router-dom";
import HeaderProfile from "../HeaderProfile/HeaderProfile";

const Header = () => {
    const { isSearchVisible, searchValue, setSearchValue } = useHeader();
    
    return (
        <header>
            <Link to="/" className={st.logo}>School Edu</Link>
            <div className={st.container}>
                {isSearchVisible && (
                    <Search value={searchValue} onChange={setSearchValue} />
                )}
            </div>
            {!window.location.href.includes('/auth') && <HeaderProfile />}
        </header>
    );
};

export default Header;
