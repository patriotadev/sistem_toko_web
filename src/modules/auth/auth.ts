import Service from './auth.service';
import { LoginPayload } from "./interfaces/auth.interface";


const login = (payload: LoginPayload) => {
    return Service.login(payload)
    .then((response: any) => Promise.resolve(response), (error => Promise.reject(error)));
}

export default { login };