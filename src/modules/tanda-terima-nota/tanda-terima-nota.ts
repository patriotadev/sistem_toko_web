import { INotaFetchQuery, ITandaTerimaNota, TandaTerimaNotaPayload, UpdateStatusPayload } from "./interfaces/tanda-terima-nota.interface";
import Service from'./tanda-terima-nota.service';

const create = (payload: TandaTerimaNotaPayload) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = (payload: TandaTerimaNotaPayload) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const updateStatus = (payload: UpdateStatusPayload) => {
    return Service.updateStatus(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = (payload: ITandaTerimaNota) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: INotaFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, updateStatus, destroy }