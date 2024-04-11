import { IInvoicePoFetchQuery, IInvoicePo, InvoicePoPayload } from "./interfaces/invoice-po.interface";
import Service from'./invoice-po.service';

const create = (payload: InvoicePoPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: InvoicePoPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

// const updateStatus = (payload: Pick<InvoicePoPayload, "id" | "status">) => {
//     return Service.updateStatus(payload)
//     .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
// }

const destroy = (payload: IInvoicePo) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IInvoicePoFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getList = (query: any) => {
    return Service.getList(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getByNota = (query: string[]) => {
    return Service.getByNota(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, getList, update, destroy, getByNota };