import { IPembayaranPo, IPo } from "../../po/interfaces/po.interface"

export interface ProjectPayload {
    nama : string
    createdBy: string
    updatedBy?: string
    ptId: string
}

export interface IProject {
    id: string
    nama : string
    createdAt?: Date
    createdBy: string
    updatedBy?: string
    ptId: string
    Pt: {
        id: string
        nama: string,
    },
    Po: IPo[]
    pembayaranPo: IPembayaranPo[]
}

export interface IFetchQuery {
    search: string | undefined
    page: number
    perPage: number,
    ptId: string,
}