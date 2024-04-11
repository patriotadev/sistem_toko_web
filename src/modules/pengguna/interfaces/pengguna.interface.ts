import IRole from "../../role/interface/role.interface"
import {IToko} from "../../toko/interfaces/toko.interface"

export interface IPengguna {
  id: string
  name: string
  email: string
  password: string
  roleId: string
  tokoId: string
  role: IRole,
  toko: IToko
}

export interface PenggunaPayload {
  name: string
  email: string
  password: string
  roleId: string
  tokoId: string
}

export interface UpdatePasswordPayload {
  newPassword: string,
  oldPassword: string
}

export interface IPenggunaFetchQuery {
    search: string | undefined
    page: number
    perPage: number
}