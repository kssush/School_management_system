import React from 'react';
import st from './CardUser.module.scss';
import MoreIcon from '../../assets/icons/more.svg'
import ClassIcon from '../../assets/icons/class.svg'
import TelephoneIcon from '../../assets/icons/telephone.svg'
import PlaceIcon from '../../assets/icons/place.svg'

const CardUser = ({user}) => {
    return(
        <div className={st.cardUser}>
            <div className={st.card}>
                <img src={MoreIcon} alt="..." />
                <div className={st.person}>
                    <div className={st.icon}></div>
                    <div className={st.text}>
                        <p>{user.surname}</p>
                        <p>{user.name} {user.patronymic ?? ''}</p>
                    </div>
                </div>
                <div className={st.line}></div>
                <div className={st.info}>
                    <div>
                        <img src={TelephoneIcon} alt="ic" />
                        <div className={st.contact}>
                            <p>{user.telephone}</p>
                            <p>telephone</p>
                        </div>
                    </div>
                    <div>
                        <img src={ClassIcon} alt="ic" />
                        <div className={st.contact}>
                            <p>{`${user.number ? `${user.number} "${user.letter}"` : '-'}`}</p>
                            <p>class</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardUser;