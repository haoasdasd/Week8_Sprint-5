export interface CreateEmployeeVerifyRequestType {
    employeeId: number
    verImageBase64?: string
    userIdVerify: number
    verCreatedDate?: number
    isActived: number
}

export interface UpdateEmployeeVerifyRequestType {
    id?: number
    employeeId: number
    verImageBase64?: string
    userIdVerify: number
    verCreatedDate?: number
    isActived: number
}
