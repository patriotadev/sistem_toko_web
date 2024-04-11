import { IParamsQuery } from './interfaces/laporan-po.interface';
import Service from'./laporan-po.service';

const getDaftarTagihan = (query: IParamsQuery) => {
    return Service.getDaftarTagihan(query)
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
}

export default { getDaftarTagihan }