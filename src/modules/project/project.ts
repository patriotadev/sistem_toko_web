import { IFetchQuery, ProjectPayload } from './interfaces/project.interface';
import Service from'./project.service';

const create = (payload: ProjectPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: ProjectPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: ProjectPayload) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getList = (query: {ptId: string}) => {
    return Service.getList(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, destroy, getList }