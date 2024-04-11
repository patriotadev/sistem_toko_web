import axiosInstance from "../../utils/axios-instance";
import { LoginPayload } from "./interfaces/auth.interface";

const login = (payload: LoginPayload) => {
    console.log(payload);
    return axiosInstance({
        method: 'post',
        url: '/auth/login',
        data: JSON.stringify(payload)
    });
}

const register = (payload: LoginPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/auth/register',
        data: JSON.stringify(payload)
    });
}

export default { login, register };