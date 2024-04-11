import { IFetchQuery, IPo, PoPayload, UpdatePembayaranPayload } from './interfaces/po.interface';
import Service from'./po.service';

const create = (payload: PoPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: PoPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const updateStatus = (payload: PoPayload) => {
    return Service.updateStatus(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const updatePembayaran = (payload: UpdatePembayaranPayload) => {
    return Service.updatePembayaran(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: IPo) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getList = (query: string) => {
    return Service.getList(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getByInvoice = (query: string[]) => {
    return Service.getByInvoice(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getRiwayatPembayaran = (query: string) => {
    return Service.getRiwayatPembayaran(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { 
    create,
    get,
    getList,
    getByInvoice,
    update,
    updateStatus,
    updatePembayaran,
    destroy,
    getRiwayatPembayaran
}