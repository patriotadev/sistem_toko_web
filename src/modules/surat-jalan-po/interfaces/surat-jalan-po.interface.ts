import { IInvoicePo } from "../../invoice-po/interfaces/invoice-po.interface"
import { IPo } from "../../po/interfaces/po.interface"
import { IPt } from "../../pt/interfaces/pt.interface"

export interface BarangSuratJalanPo {
        discount: number
        id: string
        kode: string
        nama: string
        qty: number
        satuan: string
        harga?: number
        createdBy: string
        createdAt: Date
        updatedBy: string
        stokBarangId: string
        updatedAt: Date
        suratJalanPoId: string
}

export interface SuratJalanPoPayload {
    suratJalan: {
        tanggal: Date
        namaSupir: string
        createdBy: string
        createdAt: Date
        updatedBy?: string
        updatedAt?: Date
        tokoId: string
        poId: string | undefined
    }
    barangPo: BarangSuratJalanPo[]
}

export interface ISuratJalanPo {
    id: string
    nomor: string
    tanggal: Date
    namaSupir: string
    createdBy: string
    createdAt: Date,
    updatedBy: string
    updatedAt: Date,
    poId: string
    Po: IPo
    BarangSuratJalanPo: BarangSuratJalanPo[]
    InvoicePo: IInvoicePo[]
    Pt: IPt
}

export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number
    status: string,
    poId: string,
    ptId: string,
    projectId: string,
}