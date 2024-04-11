import { IFetchQuery, StokBarangPayload } from './interfaces/stok.interface';
import Service from'./stok.service';

const create = (payload: StokBarangPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: StokBarangPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: StokBarangPayload) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getOneById = (query: string) => {
    return Service.getOneById(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, getOneById, update, destroy }