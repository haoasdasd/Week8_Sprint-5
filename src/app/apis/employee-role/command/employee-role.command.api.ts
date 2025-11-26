import http from '~/app/utils/http.util'
import {
    CreateEmployeeRoleRequestType,
    UpdateEmployeeRoleRequestType
} from '~/app/types/employee-role/request/employee-role.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const employeeRoleCommandApi = {
    createEmployeeRole: async (body: CreateEmployeeRoleRequestType) => {
        const url = '/v1/hrm/EmployeeRole'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateEmployeeRole: async (id: number, body: UpdateEmployeeRoleRequestType) => {
        const url = `/v1/hrm/EmployeeRole/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteEmployeeRole: async (id: number) => {
        const url = `/v1/hrm/EmployeeRole/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
