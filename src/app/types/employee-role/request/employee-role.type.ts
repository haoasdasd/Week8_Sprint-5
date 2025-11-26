export interface CreateEmployeeRoleRequestType {
    empRoleName: string
    empRoleCode: string
}

export interface UpdateEmployeeRoleRequestType {
    id?: number
    empRoleName: string
    empRoleCode: string
}
