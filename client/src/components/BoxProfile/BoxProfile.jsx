import React from "react";
import st from "./BoxProfile.module.scss";
import BoxInformation from "../BoxInformation/BoxInformation";

const BoxProfile = ({info, image}) => {
    return (
        <div className={st.profile}>
            <div className={st.icon}>
                {image && <img src={image} alt="ph"/>} {/* иконку и клик добвавление */}
            </div>
            <BoxInformation header={'Personal data'} info={info?.personal}/>
            <BoxInformation header={'Professional data'} info={info?.professional}/>
        </div>
    )
};

export default BoxProfile;
