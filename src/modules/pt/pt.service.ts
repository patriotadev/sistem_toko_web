import axiosInstance from "../../utils/axios-instance";
import { IFetchQuery, PtPayload } from "./interfaces/pt.interface";

const create = (payload: PtPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/pt',
        data: JSON.stringify(payload)
    });
};

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return axiosInstance({
        method: 'get',
        url: `/pt?${paginationQuery}`,
    });
};

const getList = () => {
    return axiosInstance({
        method: 'get',
        url: `/pt/list`,
    });
};

const getOneById = (query: {id: string}) => {
    return axiosInstance({
        method: 'get',
        url: `/pt?${query.id}`,
    });
};

const update = (payload: PtPayload) => {
    return axiosInstance({
        method: 'put',
        url: `/pt`,
        data: JSON.stringify(payload)
    });

};

const destroy = (payload: PtPayload) => {
    return axiosInstance({
        method: 'delete',
        url: `/pt`,
        data: JSON.stringify(payload)
    });
}


export default { create, get, getList, getOneById, update, destroy };