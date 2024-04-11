import axiosInstance from "../../utils/axios-instance";
import { IToko, ITokoFetchQuery, TokoPayload } from "./interfaces/toko.interface";

const getAll = () => {
    return axiosInstance({
        method: 'get',
        url: '/toko/list',
    });
};

const get = (query: ITokoFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return axiosInstance({
        method: 'get',
        url: `/toko?${paginationQuery}`,
    });
}

const create = (payload: TokoPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/toko',
        data: JSON.stringify(payload)
    });
}

const update = (payload: TokoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/toko',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: IToko) => {
    return axiosInstance({
        method: 'delete',
        url: '/toko',
        data: JSON.stringify(payload)
    });
}

export default { getAll, get, create, update,destroy }