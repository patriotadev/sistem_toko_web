

import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, IPo, PoPayload, UpdatePembayaranPayload } from "./interfaces/po.interface";

const create = (payload: PoPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/po',
        data: JSON.stringify(payload)
    });
}

const update = (payload: PoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/po',
        data: JSON.stringify(payload)
    });
}

const updatePembayaran = (payload: UpdatePembayaranPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/po/pembayaran',
        data: JSON.stringify(payload)
    });
}

const updateStatus = (payload: PoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/po/status',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: IPo) => {
    return axiosInstance({
        method: 'delete',
        url: '/po',
        data: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&ptId=${query.ptId}&projectId=${query.projectId}&status=${query.status}`;
    return axiosInstance({
        method: 'get',
        url: `/po?${paginationQuery}`,
    });
}

const getList = (query: string) => {
    let paginationQuery: string | undefined;
    if (query) {
        paginationQuery = `search=${query}`;
    };
    return axiosInstance({
        method: 'get',
        url: `/po/list?${paginationQuery}`,
    });
}

const getByInvoice = (poId: string[]) => {
    const paginationQuery = `id=${poId.join(", ")}`;
    return axiosInstance({
        method: 'get',
        url: `/po/invoice?${paginationQuery}`,
    });
}

const getRiwayatPembayaran = (poId: string) => {
    const paginationQuery = `poId=${poId}`;
    return axiosInstance({
        method: 'get',
        url: `/po/riwayat-pembayaran?${paginationQuery}`,
    });
}



export default { 
    create,
    get,
    getList,
    getByInvoice,
    update,
    updateStatus,
    updatePembayaran,
    destroy,
    getRiwayatPembayaran
};