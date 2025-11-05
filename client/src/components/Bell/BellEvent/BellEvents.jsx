import React from "react";
import st from "./BellEvents.module.scss";

const BellEvents = ({weekday, place, action, time, color}) => {

    console.log('123213')

    return (
        <div className={st.bellEvents}>
            <p>{weekday}</p>
            <p>{place}</p>
            <div className={st.box} style={{backgroundColor: `var(--${color}40)`, border: `1px solid var(--${color})`}}>
                <p>{action}</p>
                <p>{time}</p>
            </div>
        </div>
    );
};

export default BellEvents;
