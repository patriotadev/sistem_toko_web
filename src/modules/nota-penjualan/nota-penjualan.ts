import { INotaPenjualanFetchQuery, INotaPenjualan, NotaPenjualanPayload } from "./interfaces/nota-penjualan.interface";
import Service from'./nota-penjualan.service';

const create = (payload: NotaPenjualanPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: NotaPenjualanPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: INotaPenjualan) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: INotaPenjualanFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, destroy }