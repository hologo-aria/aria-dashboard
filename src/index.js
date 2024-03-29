import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthProvider";
import { GlobalUserProvider } from "./context/GlobalProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <GlobalUserProvider>
      <AuthProvider>
       <Routes>
        <Route path="/*" element={<App/>} />
       </Routes>
      </AuthProvider>
      </GlobalUserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
