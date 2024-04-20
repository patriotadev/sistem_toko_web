import axiosInstance from "../../utils/axios-instance";
import { IBarangPenjualanFetchQuery, IPenjualan, IPenjualanFetchQuery, PenjualanPayload, UpdatePembayaranPayload } from "./interfaces/penjualan.interface";

const create = (payload: PenjualanPayload) => {
    return axiosInstance({
        method: 'post',
        url: '/penjualan',
        data: JSON.stringify(payload)
    });
}

const update = (payload: PenjualanPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/penjualan',
        data: JSON.stringify(payload)
    });
}

const updatePembayaran = (payload: UpdatePembayaranPayload) => {
    return axiosInstance({
        method: 'put',
        url: '/penjualan/pembayaran',
        data: JSON.stringify(payload)
    });
}

const destroy = (payload: IPenjualan) => {
    return axiosInstance({
        method: 'delete',
        url: '/penjualan',
        data: JSON.stringify(payload)
    });
}

const get = (query: IPenjualanFetchQuery) => {
    const paginationQuery = `page=${query.page}&perPage=${query.perPage}&search=${query.search}&dateStart=${query.dateStart}&dateEnd=${query.dateEnd}&tokoId=${query.tokoId}`;
    return axiosInstance({
        method: 'get',
        url: `/penjualan?${paginationQuery}`
    });
}

const getBarangPenjualan = (query: IBarangPenjualanFetchQuery) => {
    return axiosInstance({
        method: 'get',
        url: `/penjualan/barang?${query}`
    });
}

const getOneById = (query: string) => {
    return axiosInstance({
        method: 'get',
        url: `/penjualan/${query}`
    });
}

const getByInvoice = (penjualanId: string[]) => {
    const paginationQuery = `id=${penjualanId.join(", ")}`;
    return axiosInstance({
        method: 'get',
        url: `/penjualan/invoice?${paginationQuery}`
    });
}

export default { create, updatePembayaran, get, getBarangPenjualan, update, destroy, getOneById, getByInvoice };