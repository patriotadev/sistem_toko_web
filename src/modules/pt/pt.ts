import { IFetchQuery, PtPayload } from './interfaces/pt.interface';
import Service from './pt.service';

const create = (payload: PtPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getList = () => {
    return Service.getList()
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getOneById = (query: { id: string }) => {
    return Service.getOneById(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: PtPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: PtPayload) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, getList, getOneById, update, destroy }