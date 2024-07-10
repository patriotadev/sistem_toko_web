import { IPaymentAccountFetchQuery } from "./interfaces/payment-account.interface";
import Service from'./payment-account.service';

const create = <T>(payload: T) => {
    return Service.create(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const update = <T>(payload: T) => {
    return Service.update(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const destroy = <T>(payload: T) => {
    return Service.destroy(payload)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const get = (query: IPaymentAccountFetchQuery) => {
    return Service.get(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

const getOne = (id: string) => {
    return Service.getOne(id)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { create, get, update, destroy, getOne }