import React from "react";

import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const auth = localStorage.getItem("auth");
 
  return auth ? <Outlet /> : <Navigate to="/" replace={true} />;
};

export default ProtectedRoutes;