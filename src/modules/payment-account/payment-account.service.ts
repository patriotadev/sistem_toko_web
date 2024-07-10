import axiosInstance from "../../utils/axios-instance";
import { IPaymentAccountFetchQuery } from "./interfaces/payment-account.interface";

const create = <T>(payload: T) => {
    return axiosInstance({
        method: 'post',
        url: '/payment-account',
        data: JSON.stringify(payload)
    });
}

const update = <T>(payload: T) => {
    return axiosInstance({
        method: 'put',
        url: '/payment-account',
        data: JSON.stringify(payload)
    });
}

const destroy = <T>(payload: T) => {
    return axiosInstance({
        method: 'delete',
        url: '/payment-account',
        data: JSON.stringify(payload)
    });
}

const get = (query: IPaymentAccountFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return axiosInstance({
        method: 'get',
        url: `/payment-account?${paginationQuery}`,
    });
}

const getOne = (params: string) => {
    return axiosInstance({
        method: 'get',
        url: `/payment-account/${params}`,
    });
}

export default { create, get, update, destroy, getOne };