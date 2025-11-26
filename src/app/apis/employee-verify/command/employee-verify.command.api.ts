import http from '~/app/utils/http.util'
import {
    CreateEmployeeVerifyRequestType,
    UpdateEmployeeVerifyRequestType
} from '~/app/types/employee-verify/request/employee-verify.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const employeeVerifyCommandApi = {
    createEmployeeVerify: async (body: CreateEmployeeVerifyRequestType) => {
        const url = '/v1/hrm/EmployeeVerify'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateEmployeeVerify: async (id: number, body: UpdateEmployeeVerifyRequestType) => {
        const url = `/v1/hrm/EmployeeVerify/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteEmployeeVerify: async (id: number) => {
        const url = `/v1/hrm/EmployeeVerify/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
