

import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, ProjectPayload } from "./interfaces/project.interface";

const create = (payload: ProjectPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/project',
        data: JSON.stringify(payload)
    });
}

const update = (payload: ProjectPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/project',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: ProjectPayload) => {
    return axiosInstance({
        method: 'delete',
        url: '/project',
        data: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&ptId=${query.ptId}`;
    return axiosInstance({
        method: 'get',
        url: `/project?${paginationQuery}`,
    });
}

const getList = (query: {ptId: string}) => {
    const paginationQuery = `ptId=${query.ptId}`;
    return axiosInstance({
        method: 'get',
        url: `/project/list?${paginationQuery}`,
    });
}

export default { create, get, update, destroy, getList };