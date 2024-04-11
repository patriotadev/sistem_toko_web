import { IBarangPenjualan } from "../../../modules/penjualan/interfaces/penjualan.interface"
import { IToko } from "../../../modules/toko/interfaces/toko.interface"

export type TokoOptionType = {
    label: string
    value: string
}

export type StokOptionType = {
    label: string
    value: string
    harga: number
    satuan: string
    qty: number
    kode: string
    stokBarangId: string
}

export type PenjualanOptionType = {
  label: string
  value: string
}

export type BarangPenjualanOptionType = {
  label: string,
  value: string | undefined
  isDisabled?: boolean
}

export type PenjualanInputs = {
  id: string
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
}