import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppSelector } from "../stores/hooks";
import { SelectUserInfo } from "../stores/common/userInfoSlice";

interface Props {
    children: string | number | boolean | Element | Iterable<ReactNode> | null | undefined
}

export const AuthGuard = ({children}: any) => {
    const authorization = Cookies.get('accessToken') ? true : false;
    return authorization ? children : <Navigate to="/login" />
}

export default AuthGuard;