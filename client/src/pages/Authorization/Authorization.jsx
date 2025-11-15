import React, { useEffect, useState } from "react";
import st from "./Authorization.module.scss";
import { useHeader } from "../../context/headerContext";
import { useMain } from "../../context/mainContext";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import { useLoginMutation } from "../../store/api/userApi";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Authorization = () => {
    const [input, setInput] = useState({});

    const navigate = useNavigate();

    const {user, setUser} = useUser();

    const [login] = useLoginMutation();

    const callbackInput = (name, value) => {
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleLogin = async () => {
        try {
            const result = await login(input).unwrap();

            if (result.user && result.token) {
                setUser(result.user);
                localStorage.setItem('accessToken', result.token);
                navigate('/', { replace: true });
            } 
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.data?.message || 'Login failed');
        }
    }

    return (
        <div className={st.authorization}>
            <div className={st.box}>
                <p>Login</p>
                <Input name="login" placeholder={'Login'} callback={callbackInput}/>
                <Input name="password" placeholder={'Password'} callback={callbackInput} type={'password'}/>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
};

export default Authorization;
