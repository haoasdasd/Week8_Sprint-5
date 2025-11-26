export interface CreateContractTypeRequestType {
    contractTypeCode: string
    contractTypeName: string
}

export interface UpdateContractTypeRequestType {
    id?: number
    contractTypeCode: string
    contractTypeName: string
}
