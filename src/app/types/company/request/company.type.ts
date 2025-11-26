import { QueryParametersRequestType } from '~/app/types/utils/api.type'

export interface CreateCompanyRequestType {
    companyPid: number | null
    taxCode: string
    password: string
    name: string
    imageBase64: string
    tel?: string
    email?: string
    website?: string
    address: string
    founder?: string
    ceo: string
    ceoImageBase64?: string
    ceoEmail?: string
    ceoTel?: string
    license?: string
    countryId: string
    wardId: number
    isActived: boolean
    departmentIds?: number[] | null
    positionIds?: number[] | null
}

export interface UpdateCompanyRequestType {
    companyPid: number | null
    taxCode: string
    name: string
    imageBase64?: string
    tel?: string
    email?: string
    website?: string
    address: string
    founder?: string
    ceo: string
    ceoImageBase64?: string
    ceoEmail?: string
    ceoTel?: string
    license?: string
    countryId: string
    wardId: number
    isActived: boolean
}

export interface LoginCompanyRequestType {
    taxCode: string
    password: string
}

export interface GetAllCompanyRequestType extends QueryParametersRequestType {
    companyName?: string
    isActived?: boolean | null
    isDescending?: boolean
}
