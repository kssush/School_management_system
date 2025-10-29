import React from "react";
import st from "./Header.module.scss";
import { useHeaderContext } from "../../context/headerContext";
import Search from "../UI/Search/Search";

const Header = () => {
    const { isSearchVisible, searchValue, setSearchValue } = useHeaderContext();

    return (
        <header>
            <div className={st.logo}>School Edu</div>
            <div className={st.container}>
                {isSearchVisible && (
                    <Search value={searchValue} onChange={setSearchValue} />
                )}
            </div>
        </header>
    );
};

export default Header;
