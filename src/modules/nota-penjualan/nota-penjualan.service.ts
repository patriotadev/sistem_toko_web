import { INotaPenjualanFetchQuery, INotaPenjualan, NotaPenjualanPayload } from "./interfaces/nota-penjualan.interface";

const create = (payload: NotaPenjualanPayload) => {
    return fetch('http://localhost:3082/api/nota-penjualan', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const update = (payload: NotaPenjualanPayload) => {
    return fetch('http://localhost:3082/api/nota-penjualan', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const destroy = (payload: INotaPenjualan) => {
    return fetch('http://localhost:3082/api/nota-penjualan', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const get = (query: INotaPenjualanFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return fetch(`http://localhost:3082/api/nota-penjualan?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export default { create, get, update, destroy };