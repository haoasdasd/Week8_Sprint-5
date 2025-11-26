import { EmployeeUpdateSchemaType } from '~/app/schemas/employee.schema'
import { QueryParametersRequestType } from '~/app/types/utils/api.type'

export interface CreateEmployeeRequestType {
    empCitizenIdentity: string
    empTaxCode: string
    empCode: string
    password: string
    empFirstName: string
    empLastName: string
    empGender: boolean
    empBirthday: number
    empImageBase64: string
    empPlaceOfBirth: number
    empTel: string
    empEmail?: string
    empEducationLevel?: string
    empJoinedDate?: number
    degreeId: number
    traMajId: number
    empAccountNumber?: string
    bankId: number
    nationId: number
    religionId: number
    maritalId: number
    empRoleId: number
    countryId: string
    companyId: number
    empPlaceOfResidenceAddress?: string
    empPlaceOfResidenceWardId: number
    isActived: number
}

export interface LoginEmployeeRequestType {
    empCode: string
    password: string
}

export interface GetAllEmployeeRequestType extends QueryParametersRequestType {
    empName?: string
    isActived?: number | null
    isDescending?: boolean

    // Filter
    degreeId?: number
    traMajId?: number
    bankId?: number
    nationId?: number
    religionId?: number
    maritalId?: number
    empRoleId?: number
    countryId?: string
    empPlaceOfResidenceWardId?: number
    empPlaceOfBirth?: number
    companyId?: number
}

export interface ChangePasswordEmployeeRequestType {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}
