import axiosInstance from "../../utils/axios-instance";
import { IParamsQuery } from "./interfaces/laporan-po.interface";

const getDaftarTagihan = (query: IParamsQuery) => {
    const filterQuery = `page=${query.page}&perPage=${query.perPage}&ptId=${query.ptId}`;
    return axiosInstance({
        method: 'get',
        url: `/laporan-po?${filterQuery}`,
    });
}

const getLaporanPenjualan = (query: any) => {
    const filterQuery = `dateStart=${query.dateStart}&dateEnd=${query.dateEnd}&tokoId=${query.tokoId}`;
    return axiosInstance({
        method: 'get',
        url: `/laporan-po/penjualan?${filterQuery}`,
    });
}


export default { getDaftarTagihan, getLaporanPenjualan };