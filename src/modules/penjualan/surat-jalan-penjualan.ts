import { ISuratJalanPenjualan, ISuratJalanPenjualanFetchQuery, SuratJalanPenjualanPayload } from './interfaces/surat-jalan-penjualan.interface';
import Service from './surat-jalan-penjualan.service';

const get = (query: ISuratJalanPenjualanFetchQuery) => {
    return Service.get(query)
    .then(response => Promise.resolve(response), error => Promise.reject(error));
}

const create = (payload: SuratJalanPenjualanPayload) => {
    return Service.create(payload)
    .then(response => Promise.resolve(response), error => Promise.reject(error));
}

const destroy = (payload: ISuratJalanPenjualan) => {
    return Service.destroy(payload)
    .then(response => Promise.resolve(response), error => Promise.reject(error));
}

const cancel = (payload: ISuratJalanPenjualan) => {
    return Service.cancel(payload)
    .then(response => Promise.resolve(response), error => Promise.reject(error));
}

export default {
    get,
    create,
    destroy,
    cancel
}