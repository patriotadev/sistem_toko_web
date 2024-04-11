import { IPenggunaFetchQuery, IPengguna, PenggunaPayload } from "./interfaces/pengguna.interface";
import Service from'./pengguna.service';

const create = (payload: PenggunaPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = <T>(payload: T) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: IPengguna) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IPenggunaFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getOne = (id: string) => {
    return Service.getOne(id)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, destroy, getOne }