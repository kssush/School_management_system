import React, { useEffect, useState } from "react";
import st from "./Authorization.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import { useLoginMutation } from "../../store/api/userApi";

const Authorization = () => {
    const [input, setInput] = useState({});

    const {hideSearch} = useHeader();
    const {setHeader, setDescription} = useMain();

    const [login] = useLoginMutation();

    const callbackInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogin = async () => {
        await login(input);
    }

    return (
        <div className={st.authorization}>
            <div className={st.box}>
                <p>Login</p>
                <Input placeholder={'Login'} callback={callbackInput}/>
                <Input placeholder={'Password'} callback={callbackInput} type={'password'}/>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
};

export default Authorization;
