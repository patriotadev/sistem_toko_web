import { IPo } from "../../po/interfaces/po.interface"

export interface BarangPoPayload {
    nama: string
    qty: number
    satuan: string
    discount?: number
    harga: number
    jumlahHarga: number
    createdBy: string
    updatedBy?: string
    poId: string
}

export interface IBarangPo {
  id: string
  nama: string
  qty: number
  satuan: string
  discount: number
  harga: number
  jumlahHarga: number
  isMaster: boolean
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  po: IPo
  poId: string
}
export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number,
    poId: string | undefined
}