import { IPo } from "../../po/interfaces/po.interface"
import { IProject } from "../../project/interfaces/project.interface"
import { IPt } from "../../pt/interfaces/pt.interface"
import { BarangSuratJalanPo, ISuratJalanPo } from "../../surat-jalan-po/interfaces/surat-jalan-po.interface"
import { ITandaTerimaNotaList } from "../../tanda-terima-nota/interfaces/tanda-terima-nota.interface"

export interface IInvoicePoList {
    id: string
    invoicePoId: string
    poId: string
}

export interface IInvoicePo {
    id: string
    jatuhTempo: number,
    nomor: string
    status: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    InvoicePoList: IInvoicePoList[]
    SuratJalanPo: ISuratJalanPo
    TandaTerimaNotaList: ITandaTerimaNotaList[]
    Po: IPo
    BarangSj: BarangSuratJalanPo[]
    Pt: IPt
    totalJumlah: number
    Project: IProject
}

export interface PoListPayload  {
    po: IPo
}

export interface InvoicePoPayload {
    id?: string
    poId: string
    suratJalanPoId: string
    tokoId: string
    createdBy?: string
    createdAt?: Date
    updatedBy?: string
    updatedAt?: Date
}

export interface IInvoicePoFetchQuery {
    search: string | undefined
    page: number
    perPage: number
    ptId: string
    projectId: string
    suratJalanPoId: string
}