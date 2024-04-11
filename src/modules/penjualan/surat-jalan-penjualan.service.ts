import { ISuratJalanPenjualan, ISuratJalanPenjualanFetchQuery, SuratJalanPenjualanPayload } from "./interfaces/surat-jalan-penjualan.interface";

const get = (query: ISuratJalanPenjualanFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
    return fetch(`http://localhost:3082/api/penjualan/surat-jalan?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

const create = (payload: SuratJalanPenjualanPayload) => {
    return fetch(`http://localhost:3082/api/penjualan/surat-jalan`, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

const destroy = (payload: ISuratJalanPenjualan) => {
    return fetch(`http://localhost:3082/api/penjualan/surat-jalan`, {
        method: 'delete',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

const cancel = (payload: ISuratJalanPenjualan) => {
    return fetch(`http://localhost:3082/api/penjualan/surat-jalan/cancel`, {
        method: 'put',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

export default {
    get,
    create,
    destroy,
    cancel
}