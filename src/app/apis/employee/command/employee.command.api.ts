import http from '~/app/utils/http.util'
import {
    CreateEmployeeRequestType,
    LoginEmployeeRequestType,
    UpdateEmployeeRequestType
} from '~/app/types/employee/request/employee.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import { LoginResponseType } from '~/app/types/auth/response/auth.type'

export const employeeCommandApi = {
    createEmployee: async (body: CreateEmployeeRequestType) => {
        const url = '/v1/hrm/Employee'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateEmployee: async (id: number, body: UpdateEmployeeRequestType) => {
        const url = `/v1/hrm/Employee/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteEmployee: async (id: number) => {
        const url = `/v1/hrm/Employee/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    },
    loginEmployee: async (body: LoginEmployeeRequestType) => {
        const url = '/v1/hrm/Employee/login'
        const response = (await http.post(url, body)) as LoginResponseType
        return response
    },
    resetPassword: async (id: number) => {
        const url = `/v1/hrm/Employee/ResetPassword/${id}`
        const response = (await http.put(url)) as ResponseMessageType<null>
        return response.data
    },
    changePassword: async (id: number, body: ChangePasswordEmployeeRequestType) => {
        const url = '/v1/hrm/Employee/ChangePassword' + `/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response
    }
}
