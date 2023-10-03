export interface StokBarangPayload {
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    tokoId: string
}

export interface IStok {
    id: string,
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    tokoId: string
    toko: {
        id: string
        description: string
    }
}

export interface IFetchQuery {
    page: number
    perPage: number
}