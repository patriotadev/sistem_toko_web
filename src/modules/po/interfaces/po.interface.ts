import { ISuratJalanPo } from "../../surat-jalan-po/interfaces/surat-jalan-po.interface"

export interface BarangPoPayload {
    barangPo: {
            nama: string,
            qty: number,
            satuan: string,
            harga: number,
            jumlahHarga: number,
            discount: number
    }
}

export interface PoPayload {
    po: {
        noPo: string
        tanggal: Date
        jatuhTempo: number
        createdBy: string
        updatedBy?: string
        ptId: string
        projectId: string
    },
}

export interface IBarangPo {
    id: string,
    kode: string
    nama: string,
    qty: number,
    satuan: string,
    harga: number,
    jumlahHarga: number,
    discount: number,
    step: number
    isMaster: boolean
    poId: string,
    stokBarangId: string
    createdBy: string,
    createdAt: Date,
}

export interface IPembayaranPo {
    id: string
    poId: string
    totalPembayaran: number
    jumlahBayar: number
    metode: string
    isApprove: boolean
    createdBy: string
    createdAt: Date
    approvedAt: Date
    approvedBy: string
    updatedBy: string
    updatedAt: Date
}

export interface IPo {
    id: string
    noPo: string
    tanggal: Date
    jatuhTempo: number
    createdAt?: Date
    createdBy: string
    updatedBy?: string
    ptId: string
    projectId: string
    status: string
    statusSJ: string
    BarangPo: IBarangPo[],
    SuratJalanPo: ISuratJalanPo[]
    Pt: {
        id: string
        nama: string,
    }
    Project: {
        id: string
        nama: string
    }
    PembayaranPo: IPembayaranPo[]
}

export interface UpdatePembayaranPayload {
    id?: string
    metode: string | undefined
    jumlahBayar: number
    updatedAt: Date
    updatedBy: string
    isApprove: boolean | null | undefined
    approvedAt?: Date | null
    approvedBy?: string | null
  }

export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number
    ptId: string
    projectId: string
    status: string
}