import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/_fonts.scss'
import './styles/_variables.scss'
import './styles/_global.scss'
import { HeaderProvider } from "./context/headerContext";
import { BrowserRouter } from "react-router-dom";
import { MainProvider } from "./context/mainContext";
import store from "./store";
import { Provider } from "react-redux";
import { ScheduleProvider } from "./context/scheduleContext";
import { UserProvider } from "./context/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

        <BrowserRouter>
            <UserProvider>
                <HeaderProvider>
                    <MainProvider>
                        <ScheduleProvider>
                            <Provider store={store}>
                                <App />
                            </Provider>
                        </ScheduleProvider>        
                    </MainProvider>
                </HeaderProvider>
            </UserProvider>
        </BrowserRouter>
);
