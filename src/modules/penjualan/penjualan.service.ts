import { IBarangPenjualanFetchQuery, IPenjualan, IPenjualanFetchQuery, PenjualanPayload, UpdatePembayaranPayload } from "./interfaces/penjualan.interface";

const create = (payload: PenjualanPayload) => {
    return fetch('http://localhost:3082/api/penjualan', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const update = (payload: PenjualanPayload) => {
    return fetch('http://localhost:3082/api/penjualan', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const updatePembayaran = (payload: UpdatePembayaranPayload) => {
    return fetch('http://localhost:3082/api/penjualan/pembayaran', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const destroy = (payload: IPenjualan) => {
    return fetch('http://localhost:3082/api/penjualan', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

const get = (query: IPenjualanFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&dateStart=${query.dateStart}&dateEnd=${query.dateEnd}&tokoId=${query.tokoId}`;
    return fetch(`http://localhost:3082/api/penjualan?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

const getBarangPenjualan = (query: IBarangPenjualanFetchQuery) => {
    return fetch(`http://localhost:3082/api/penjualan/barang?${query}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

const getOneById = (query: string) => {
    return fetch(`http://localhost:3082/api/penjualan/${query}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

const getByInvoice = (penjualanId: string[]) => {
    const paginationQuery = `id=${penjualanId.join(", ")}`;
    console.log(paginationQuery);
    return fetch(`http://localhost:3082/api/penjualan/invoice?${paginationQuery}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export default { create, updatePembayaran, get, getBarangPenjualan, update, destroy, getOneById, getByInvoice };