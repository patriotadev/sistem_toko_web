import { IProject } from "../../project/interfaces/project.interface"

export interface PtPayload {
    nama: string
    alamat: string
    telepon: string
    createdBy: string
    updatedBy?: string
}

export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number
}

export interface IPt {
    id: string
    nama: string
    alamat: string
    telepon: string
    createdBy: string
    Project?: IProject[]
}