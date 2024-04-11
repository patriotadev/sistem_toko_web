import { IToko } from "../../toko/interfaces/toko.interface"

export interface StokBarangPayload {
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    updatedBy?: string
    tokoId: string
}

export interface IStok {
    id: string,
    kode: string
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    jumlahPo?: string
    hargaJual: number
    createdBy: string
    tokoId: string
    toko: IToko
    isPo: boolean
}

export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number,
    tokoId: string
    tab: string
}