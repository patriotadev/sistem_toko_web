import { IFetchQuery, ISuratJalanPo, SuratJalanPoPayload } from './interfaces/surat-jalan-po.interface';
import Service from'./surat-jalan-po.service';

const create = (payload: SuratJalanPoPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: SuratJalanPoPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: ISuratJalanPo) => {
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

const cancel = (payload: ISuratJalanPo) => {
    return Service.cancel(payload)
    .then(response => Promise.resolve(response), error => Promise.reject(error));
}

export default { create, get, getList, update, destroy, cancel }