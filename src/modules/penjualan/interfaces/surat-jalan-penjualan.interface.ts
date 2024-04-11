import { IPenjualan } from "./penjualan.interface";

export interface IBarangSuratJalanPenjualan {
    id: string
    nama: string
    qty: number
    satuan: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    isMaster: boolean
    step: number
    suratJalanPenjualan: ISuratJalanPenjualan
    suratJalanPenjualanId: string
}

export interface ISuratJalanPenjualan {
    id: string
    nomor: string
    namaSupir: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    penjualan: IPenjualan
    penjualanId: string
    BarangSuratJalanPenjualan: IBarangSuratJalanPenjualan[]
}

export interface SuratJalanPenjualanPayload {
    detail: {
        namaSupir: string
        penjualanId: string
    },
    barang: IBarangSuratJalanPenjualan[]
}

export interface ISuratJalanPenjualanFetchQuery {
    search: string | undefined,
    page: number,
    perPage: number
}