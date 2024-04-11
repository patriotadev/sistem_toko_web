import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, BarangPoPayload } from "./interfaces/barang-po.interface";

const create = (payload: BarangPoPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/barang-po',
        data: JSON.stringify(payload)
    });
}

const update = (payload: BarangPoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/barang-po',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: BarangPoPayload) => {
    return axiosInstance({
        method: 'delete',
        url: '/barang-po',
        data: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&poId=${query.poId}`;
    return axiosInstance({
        method: 'get',
        url: `/barang-po?${paginationQuery}`
    });
}

export default { create, get, update, destroy };