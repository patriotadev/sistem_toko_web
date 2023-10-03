import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({children}) => {
    const authorization = Cookies.get('accessToken') ? true : false;
    return authorization ? children : <Navigate to="/login" />
}

export default AuthGuard;