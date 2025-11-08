import React from 'react';
import st from './BoxInformation.module.scss';

const BoxInformation = ({header, info}) => {
    return(
        <div className={st.box}>
            <p>{header}</p>
            <div className={st.content}>
                {info?.map((inf, index) => (
                    <div className={st.contentItem} key={index}>
                        <p>{inf.value}</p>
                        <p>{inf.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BoxInformation;