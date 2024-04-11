import axiosInstance from "../../utils/axios-instance";
import { IPenggunaFetchQuery, IPengguna, PenggunaPayload } from "./interfaces/pengguna.interface";

const create = (payload: PenggunaPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/user',
        data: JSON.stringify(payload)
    });
}

const update = <T>(payload: T) => {
    return axiosInstance({
        method: 'put',
        url: '/user',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: IPengguna) => {
    return axiosInstance({
        method: 'delete',
        url: '/user',
        data: JSON.stringify(payload)
    });
}

const get = (query: IPenggunaFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return axiosInstance({
        method: 'get',
        url: `/user?${paginationQuery}`,
    });
}

const getOne = (params: string) => {
    return axiosInstance({
        method: 'get',
        url: `/user/${params}`,
    });
}

export default { create, get, update, destroy, getOne };