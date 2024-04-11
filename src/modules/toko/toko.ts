import { IToko, ITokoFetchQuery, TokoPayload } from './interfaces/toko.interface';
import Service from './toko.service';

const getAll = () => {
    return Service.getAll()
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

const get = (query: ITokoFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

const create = (payload: TokoPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

const update = (payload: TokoPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

const destroy = (payload: IToko) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { getAll, get, create, update, destroy };