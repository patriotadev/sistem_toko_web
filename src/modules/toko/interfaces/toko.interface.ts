import { IPengguna } from "../../pengguna/interfaces/pengguna.interface"

export interface IToko {
    id: string
    description: string
    contact: string
    address: string
    city: string
    User: IPengguna[]
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