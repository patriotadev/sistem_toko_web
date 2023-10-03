import { LoginPayload } from "./interfaces/auth.interface";

const login = (payload: LoginPayload) => {
    return fetch('http://localhost:3082/api/auth/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const register = (payload: LoginPayload) => {
    return fetch('http://localhost:3082/api/auth/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

export default { login, register };