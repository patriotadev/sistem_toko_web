import { IInvoicePenjualanFetchQuery, IInvoicePenjualan, InvoicePenjualanPayload } from "./interfaces/invoice-penjualan.interface";

const create = (payload: InvoicePenjualanPayload) => {
    return fetch('http://localhost:3082/api/invoice-penjualan', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const update = (payload: InvoicePenjualanPayload) => {
    return fetch('http://localhost:3082/api/invoice-penjualan', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const destroy = (payload: IInvoicePenjualan) => {
    return fetch('http://localhost:3082/api/invoice-penjualan', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const get = (query: IInvoicePenjualanFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return fetch(`http://localhost:3082/api/invoice-penjualan?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

const getByNota = (invoicePenjualanId: string[]) => {
    const paginationQuery = `id=${invoicePenjualanId.join(", ")}`;
    console.log(paginationQuery);
    return fetch(`http://localhost:3082/api/invoice-penjualan/nota?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

const updateStatus = (payload: Pick<InvoicePenjualanPayload, "id" | "status">) => {
    console.log(payload);
    return fetch('http://localhost:3082/api/invoice-penjualan/status', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}


export default { create, get, getByNota, update, destroy, updateStatus };