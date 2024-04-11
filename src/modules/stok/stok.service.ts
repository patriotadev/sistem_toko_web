import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, StokBarangPayload } from "./interfaces/stok.interface";

const create = (payload: StokBarangPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/stok',
        data: JSON.stringify(payload)
    });
}

const update = (payload: StokBarangPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/stok',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: StokBarangPayload) => {
    return axiosInstance({
        method: 'delete',
        url: '/stok',
        data: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&tokoId=${query.tokoId}&tab=${query.tab}`;
    return axiosInstance({
        method: 'get',
        url: `/stok?${paginationQuery}`
    });
}

const getOneById = (query: string) => {
    return axiosInstance({
        method: 'get',
        url: `/stok/${query}`
    });
}

export default { create, get, update, destroy, getOneById };