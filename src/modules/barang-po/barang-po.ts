import { IFetchQuery, BarangPoPayload } from './interfaces/barang-po.interface';
import Service from'./barang-po.service';

const create = (payload: BarangPoPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: BarangPoPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: BarangPoPayload) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, destroy }