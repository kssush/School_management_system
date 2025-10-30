import React from "react";
import st from "./Main.module.scss";
import { useMain } from "../../context/mainContext";

const Main = ({children}) => {
    const {header, description} = useMain();
    
    return(
        <main>
            <div>
                <div className={st.mainText}>
                    <p>{header}</p>
                    <p>{description}</p>
                </div>
            </div>
            <div className={st.line}></div>
            {children}
        </main>
    );
};

export default Main;
