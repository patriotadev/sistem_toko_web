import { IInvoicePo } from "../../invoice-po/interfaces/invoice-po.interface"
import { IProject } from "../../project/interfaces/project.interface"
import { IPt } from "../../pt/interfaces/pt.interface"

export interface ITandaTerimaNotaList {
    id: string
    tandaTerimaNotaId: string
    invoicePoId: string
}
export interface ITandaTerimaNota {
    id: string
    nomor: string
    jatuhTempo: number
    status: string
    tanggal: Date
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    TandaTerimaNotaList: ITandaTerimaNotaList[]
    Invoice: any
    totalJumlahInvoice: any
    Pt: IPt
    Project: IProject
}

export interface InvoicePoListPayload  {
    invoicePo: IInvoicePo
}

export interface UpdateStatusPayload {
    id: string,
    status: string
}

export interface TandaTerimaNotaPayload {
    tokoId: string
    jatuhTempo: number
    tanggal: Date
    createdBy?: string
    invoicePoListPayload: InvoicePoListPayload[]
};

export interface INotaFetchQuery {
    search: string | undefined
    page: number
    perPage: number
    ptId: string
    projectId: string
}