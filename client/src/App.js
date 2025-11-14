import React, { useState } from "react";
import Header from "./components/Header/Header";
import Aside from "./components/Aside/Aside";
import Main from "./components/Main/Main";
import AppRouter from "./components/AppRouter/AppRouter";
import Authorization from "./pages/Authorization/Authorization";

function App() {
    const [user, ] = useState(false);

    return (
        <>  
            <Header />
            {
                user ? (
                    <div className="body">
                        <Aside />
                        <Main>
                            <AppRouter />
                        </Main>
                    </div>
                ) : (
                    <Authorization />
                )
            }
        </>
    )
}

export default App;
