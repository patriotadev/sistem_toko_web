import { IToko } from "../../toko/interfaces/toko.interface"

export interface IBarangPenjualan {
  id?: string
  kode: string
  nama: string
  qty: number
  satuan: string
  harga: string
  isMaster: boolean
  step: number
  discount?: number
  createdBy: string
  jumlahHarga: number
  stokBarangId: string
}

export interface IPembayaranPenjualan {
  id?: string
  penjualanId: string
  totalPembayaran: number
  jumlahBayar: number
  metode: string
  isApprove: boolean
  approvedAt?: Date
  approvedBy?: string
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
}

export interface IPenjualan {
  id: string
  nomor: string
  namaPelanggan: string
  kontakPelanggan: string
  alamatPelanggan: string
  jumlahTotal: number
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  toko: IToko[]
  tokoId: string
  BarangPenjualan: IBarangPenjualan[]
  PembayaranPenjualan: IPembayaranPenjualan[]
}

export interface PenjualanPayload {
    detail: {
      id?: string
      namaPelanggan: string
      kontakPelanggan: string
      alamatPelanggan: string
      jumlahTotal?: number
      createdBy: string
      createdAt: Date
      updatedBy?: string
      tokoId: string
    },
    barang: IBarangPenjualan[]
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

export interface IPenjualanFetchQuery {
    search: string | undefined,
    page: number,
    perPage: number
    dateStart: Date | null,
    dateEnd: Date | null,
    tokoId: string | undefined,
}

export interface IBarangPenjualanFetchQuery {
  penjualanId: string
}