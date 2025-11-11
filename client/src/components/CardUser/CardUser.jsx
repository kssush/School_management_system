import React, { useState } from 'react';
import st from './CardUser.module.scss';
import MoreIcon from '../../assets/icons/more.svg'
import ClassIcon from '../../assets/icons/class.svg'
import TelephoneIcon from '../../assets/icons/telephone.svg'
import PlaceIcon from '../../assets/icons/place.svg'
import { Link } from 'react-router-dom';

const CardUser = ({user, isClass = false}) => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className={st.cardUser}>
            <div className={st.card}>
                <img src={MoreIcon} alt="..." onClick={() => setIsOpen(!isOpen)}/>
                <div className={`${st.link} ${isOpen ? st.active : ''}`}>
                    {user.role == 'teacher' && <Link to={`/profile/${user.id}`} className={st.linkItem}>profile</Link>}
                    {user.role == 'teacher' && <Link to={`/teacherSchedule/${user.id}`} className={st.linkItem}>schedule</Link>}
                    {user.role != 'teacher' && <Link to={`/family/${user.id}`} className={st.linkItem}>family</Link>}
                </div>
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
                        <img src={!isClass ? ClassIcon : PlaceIcon} alt="ic" />
                        <div className={st.contact}>
                            {!isClass ? (
                                <>
                                    <p>{`${user.number ? `${user.number} "${user.letter}"` : '-'}`}</p>
                                    <p>class</p>
                                </>
                            ) : (
                                <>
                                    <p>{user.address}</p>
                                    <p>adress</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardUser;