import axios from 'axios';
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const refreshToken = Cookies.get('refreshToken');
const refreshAccessToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/auth/token`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Application-Token": import.meta.env.VITE_APP_KEY,
            "X-Application-Name": import.meta.env.VITE_APP_NAME
        },
        body: JSON.stringify({refreshToken})
    });
    const result = await res.json();
    return result?.data?.accessToken;
};

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = Cookies.get('accessToken');
    const tokenValidate = Cookies.get('isTokenExpired');
    let newAccessToken: string;
    if (!tokenValidate) {
        newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            Cookies.set('accessToken', newAccessToken, {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
            Cookies.set('isTokenExpired', newAccessToken, {expires: Number((1 / 1440) * 10 )});
            config.headers.Authorization = `Bearer ${newAccessToken}`;
        }
    }
    if (accessToken && tokenValidate) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers["Content-Type"] = 'application/json';
    config.headers["X-Application-Token"] = import.meta.env.VITE_APP_KEY;
    config.headers["X-Application-Name"] = import.meta.env.VITE_APP_NAME;
    return config;
}, (err) => {
    return Promise.reject(err);
});

// Response
axiosInstance.interceptors.response.use(
    (response: any) => {
        return response;
    },
    async function (error) {
        const newAccessToken: any = await refreshAccessToken();
        const config = error?.config;
        if (error.response.status && error.response.status !== 403 ) {
            return Promise.reject(error);
        }
        if (error.response.status === 403 && newAccessToken) {
            console.log(error.response.status, "axios instance status");
            console.log(newAccessToken, "accessToken status");
            Cookies.set('accessToken', newAccessToken, {expires: Number(import.meta.env.VITE_APP_SESSION_TIME)});
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${newAccessToken}`
            }
        }
        if (newAccessToken === undefined) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/login'
        }
    }
);

export default axiosInstance;
