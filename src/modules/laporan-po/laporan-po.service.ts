import axiosInstance from "../../utils/axios-instance";
import { IParamsQuery } from "./interfaces/laporan-po.interface";

const getDaftarTagihan = (query: IParamsQuery) => {
    const filterQuery = `page=${query.page}&perPage=${query.perPage}&ptId=${query.ptId}`;
    return axiosInstance({
        method: 'get',
        url: `/laporan-po?${filterQuery}`,
    });
}

export default { getDaftarTagihan };