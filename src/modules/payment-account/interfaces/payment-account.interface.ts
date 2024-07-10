export interface IPaymentAccount {
    id: string
    bankName: string
    accountNumber: string
    accountName: string
}

export interface PaymentAccountPayload {
    bankName: string
    accountNumber: string
    accountName: string
}

export interface IPaymentAccountFetchQuery {
    search: string | undefined
    page: number
    perPage: number
}