import { IInvoicePenjualan } from "../../invoice-penjualan/interfaces/invoice-penjualan.interface"

export interface INotaPenjualanList {
    id: string
    notaPenjualanId: string
    invoicePenjualanId: string
}
export interface INotaPenjualan {
    id: string
    nomor: string
    tanggal: Date
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    NotaPenjualanList: INotaPenjualanList[]
}

export interface InvoicePenjualanListPayload  {
    invoicePo: IInvoicePenjualan
}

export interface NotaPenjualanPayload {
    tokoId: string
    tanggal: Date
    createdBy?: string
    invoicePenjualanListPayload: InvoicePenjualanListPayload[]
};

export interface INotaPenjualanFetchQuery {
    search: string | undefined
    page: number
    perPage: number
}