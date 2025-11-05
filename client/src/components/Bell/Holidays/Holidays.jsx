import React from "react";
import st from "./Holidays.module.scss";

const Holidays = ({time_of_year, date, icon, color}) => {
    return (
        <div className={st.holidayBox} style={{backgroundColor: `var(--${color})`}}>
            <div className={st.icon}>
                <img src={icon} alt="ic" />
            </div>
            <div className={st.text}>
                <p>{time_of_year}</p>
                <p>{date}</p>
            </div>
        </div>
    )
};

export default Holidays;
