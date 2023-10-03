import { IFetchQuery, StokBarangPayload } from './interfaces/stok.interface';
import Service from'./stok.service';

const create = (payload: StokBarangPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get }