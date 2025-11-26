import http from '~/app/utils/http.util'
import { EmployeeRoleType } from '~/app/types/employee-role/response/employee-role.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const employeeRoleQueryApi = {
    getAllEmployeeRole: async () => {
        const url = '/v1/hrm/EmployeeRole'
        const response = (await http.get(url)) as ResponseMessageType<EmployeeRoleType[]>
        return response.data
    },
    getEmployeeRoleById: async (id: number) => {
        const url = `/v1/hrm/EmployeeRole/${id}`
        const response = (await http.get(url)) as ResponseMessageType<EmployeeRoleType>
        return response.data
    }
}
