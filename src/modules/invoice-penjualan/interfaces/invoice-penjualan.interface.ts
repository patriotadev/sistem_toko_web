import { IPenjualan } from "../../penjualan/interfaces/penjualan.interface"

export interface IInvoicePenjualanList {
    id: string
    invoicePenjualanId: string
    penjualanId: string
}

export interface IInvoicePenjualan {
    id: string
    nomor: string
    status: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    InvoicePenjualanList: IInvoicePenjualanList[]
}

export interface PenjualanListPayload  {
    penjualan: IPenjualan
}

export interface InvoicePenjualanPayload {
    id?: string
    tokoId: string
    status: string
    createdBy?: string
    createdAt?: Date
    updatedBy?: string
    updatedAt?: Date
    penjualanListPayload: PenjualanListPayload[]
}

export interface IInvoicePenjualanFetchQuery {
    search: string | undefined
    page: number
    perPage: number
}
