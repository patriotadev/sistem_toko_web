import { IPengguna } from "../../pengguna/interfaces/pengguna.interface"
import { IStok } from "../../stok/interfaces/stok.interface"

export interface IToko {
    id: string
    description: string
    contact: string
    address: string
    city: string
    User: IPengguna[]
    StokBarang: IStok[]
}

export interface TokoPayload {
    description: string
    contact: string
    address: string
    city: string
}

export interface ITokoFetchQuery {
    search: string | undefined,
    page: number,
    perPage: number,
}