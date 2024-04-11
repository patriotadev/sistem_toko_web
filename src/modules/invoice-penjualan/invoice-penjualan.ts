import { IInvoicePenjualanFetchQuery, IInvoicePenjualan, InvoicePenjualanPayload } from "./interfaces/invoice-penjualan.interface";
import Service from'./invoice-penjualan.service';

const create = (payload: InvoicePenjualanPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: InvoicePenjualanPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const updateStatus = (payload: Pick<InvoicePenjualanPayload, "id" | "status">) => {
    return Service.updateStatus(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: IInvoicePenjualan) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IInvoicePenjualanFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getByNota = (query: string[]) => {
    return Service.getByNota(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, updateStatus, destroy, getByNota };