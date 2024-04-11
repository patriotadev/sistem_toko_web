import { IBarangPenjualanFetchQuery, IPenjualan, IPenjualanFetchQuery, PenjualanPayload, UpdatePembayaranPayload } from './interfaces/penjualan.interface';
import Service from'./penjualan.service';

const create = (payload: PenjualanPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: PenjualanPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const updatePembayaran = (payload: UpdatePembayaranPayload) => {
    return Service.updatePembayaran(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: IPenjualan) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IPenjualanFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getBarangPenjualan = (query: IBarangPenjualanFetchQuery) => {
    return Service.getBarangPenjualan(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getOneById = (query: string) => {
    return Service.getOneById(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getByInvoice = (query: string[]) => {
    return Service.getByInvoice(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { 
    create,
    updatePembayaran,
    get,
    getBarangPenjualan,
    getOneById,
    update,
    destroy,
    getByInvoice
};