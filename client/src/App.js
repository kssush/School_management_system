import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Aside from "./components/Aside/Aside";
import Main from "./components/Main/Main";
import AppRouter from "./components/AppRouter/AppRouter";
import Authorization from "./pages/Authorization/Authorization";
import { useUser } from "./context/userContext";
import { useCheckAuthQuery, useRefreshQuery } from "./store/api/userApi";

function App() {
    const [isLoading, setIsLoading] = useState(true);

    const { user, setUser } = useUser();

    const { data: checkAuth, error } = useCheckAuthQuery();

    useEffect(() => {
        console.log(checkAuth, error)
        if (checkAuth) {
            setUser(checkAuth.user);
            localStorage.setItem('accessToken', checkAuth.token); 
            setIsLoading(false);
        }
        
        if (error) {
            console.log('Auth failed:', error);
            setIsLoading(false);
        }

    }, [checkAuth, error]);

    if(isLoading) return (
        <div>loading</div>
    )

    return (
        <>  
            <Header />
            {user ? (
                <div className="body">
                    <Aside />
                    <Main>
                        <AppRouter />
                    </Main>
                </div>
            ) : (
                <Authorization />
            )}
        </>
    )
}

export default App;
