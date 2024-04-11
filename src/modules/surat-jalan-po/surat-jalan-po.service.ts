import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, ISuratJalanPo, SuratJalanPoPayload } from "./interfaces/surat-jalan-po.interface";

const create = (payload: SuratJalanPoPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/surat-jalan-po',
        data: JSON.stringify(payload)
    });
}

const update = (payload: SuratJalanPoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/surat-jalan-po',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: ISuratJalanPo) => {
    return axiosInstance({
        method: 'delete',
        url: '/surat-jalan-po',
        data: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&status=${query.status}&poId=${query.poId}&ptId=${query.ptId}&projectId=${query.projectId}`;
    return axiosInstance({
        method: 'get',
        url: `/surat-jalan-po?${paginationQuery}`,
    });
}

const getList = (query: string) => {
    let paginationQuery: string | undefined;
    if (query) {
        paginationQuery = `search=${query}`;
    };
    return axiosInstance({
        method: 'get',
        url: `/surat-jalan-po/list?${paginationQuery}`,
    });
}

const cancel = (payload: ISuratJalanPo) => {
    return axiosInstance({
        method: 'put',
        url: '/surat-jalan-po/cancel',
        data: JSON.stringify(payload)
    });
};

export default { create, get, getList, update, destroy, cancel };