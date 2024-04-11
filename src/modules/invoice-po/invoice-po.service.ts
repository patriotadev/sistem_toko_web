import axiosInstance from "../../utils/axios-instance";
import { IInvoicePoFetchQuery, IInvoicePo, InvoicePoPayload } from "./interfaces/invoice-po.interface";

const create = (payload: InvoicePoPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/invoice-po',
        data: JSON.stringify(payload)
    });
}

const update = (payload: InvoicePoPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/invoice-po',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: IInvoicePo) => {
    return axiosInstance({
        method: 'delete',
        url: '/invoice-po',
        data: JSON.stringify(payload)
    });
}

const get = (query: IInvoicePoFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&ptId=${query.ptId}&projectId=${query.projectId}&suratJalanPoId=${query.suratJalanPoId}`;
    return axiosInstance({
        method: 'get',
        url: `/invoice-po?${paginationQuery}`
    });
}

const getList = (query: any) => {
    const paginationQuery = `ptId=${query.ptId}&projectId=${query.projectId}`;
    return axiosInstance({
        method: 'get',
        url: `/invoice-po/list?${paginationQuery}`
    });
}

const getByNota = (invoicePoId: string[]) => {
    const paginationQuery = `id=${invoicePoId.join(", ")}`;
    return axiosInstance({
        method: 'get',
        url: `/invoice-po/nota?${paginationQuery}`
    });
}

// const updateStatus = (payload: Pick<InvoicePoPayload, "id" | "status">) => {
//     return axiosInstance({
//         method: 'put',
//         url: '/invoice-po/status',
//         data: JSON.stringify(payload)
//     });
// }

export default { create, get, getList, getByNota, update, destroy };