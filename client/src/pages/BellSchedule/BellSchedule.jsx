import React, { useEffect, useState } from "react";
import st from "./BellSchedule.module.scss";
import { useMain } from "../../context/mainContext";
import TextButton from "../../components/UI/TextButton/TextButton";
import Button from "../../components/UI/Button/Button";
import ClockIcon from '../../assets/icons/clock.svg'
import BellLessons from "../../components/Bell/BellsLesson/BellLessons";

const BellSchedule = () => {
    const [shift, setShift] = useState(1);
    const [time, setTime] = useState(false);

    const { setHeader, setDescription } = useMain();

    useEffect(() => {
        setHeader("Bell schedule");
        setDescription("All bells in one place");
    }, []);

    return (
        <>
            <div className={st.setting}>
                <TextButton name={'Shift'}>
                    <Button data={'1'} active={shift == 1 ? true : false} callback={() => setShift(1)} />
                    <Button data={'2'} active={shift == 2 ? true : false} callback={() => setShift(2)} />
                </TextButton>
                <TextButton name={'Reduced'}>
                    <Button data={ClockIcon} active={time} callback={() => setTime(!time)} />
                </TextButton>
            </div>
            <div className={st.bellsContainer}>
                <BellLessons shift={shift} />
            </div>
        </>
    );
};

export default BellSchedule;
