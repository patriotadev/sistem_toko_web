import { IFetchQuery, StokBarangPayload } from "./interfaces/stok.interface";

const create = (payload: StokBarangPayload) => {
    return fetch('http://localhost:3082/api/stok', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const get = (query: IFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}`;
    return fetch(`http://localhost:3082/api/stok?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export default { create, get }