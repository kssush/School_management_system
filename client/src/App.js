import React from "react";
import Header from "./components/Header/Header";
import Aside from "./components/Aside/Aside";
import Main from "./components/Main/Main";
import AppRouter from "./components/AppRouter/AppRouter";

function App() {
    return (
        <>
            <Header />
            <div className="body">
                <Aside />
                <Main>
                    <AppRouter />
                </Main>
            </div>
        </>
    )
}

export default App;
