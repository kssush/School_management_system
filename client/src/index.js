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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

        <BrowserRouter>
            <HeaderProvider>
                <MainProvider>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </MainProvider>
            </HeaderProvider>
        </BrowserRouter>
);
