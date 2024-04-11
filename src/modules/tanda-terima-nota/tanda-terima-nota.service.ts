import axiosInstance from "../../utils/axios-instance";
import { INotaFetchQuery, ITandaTerimaNota, TandaTerimaNotaPayload, UpdateStatusPayload } from "./interfaces/tanda-terima-nota.interface";

const create = (payload: TandaTerimaNotaPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/tanda-terima-nota',
        data: JSON.stringify(payload)
    });
}

const update = (payload: TandaTerimaNotaPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/tanda-terima-nota',
        data: JSON.stringify(payload)
    });
}

const updateStatus = (payload: UpdateStatusPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/tanda-terima-nota/status',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: ITandaTerimaNota) => {
    return axiosInstance({
        method: 'delete',
        url: '/tanda-terima-nota',
        data: JSON.stringify(payload)
    });
}

const get = (query: INotaFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&ptId=${query.ptId}&projectId=${query.projectId}`;
    return axiosInstance({
        method: 'get',
        url: `/tanda-terima-nota?${paginationQuery}`,
    });
}

export default { create, get, update, updateStatus, destroy };