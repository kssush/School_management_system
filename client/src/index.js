import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/_variables.scss'
import './styles/_global.scss'
import { HeaderProvider } from "./context/headerContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <HeaderProvider>
                <App />
            </HeaderProvider>
        </BrowserRouter>
    </React.StrictMode>
);
