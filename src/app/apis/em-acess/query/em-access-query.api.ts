import { EmployeeType } from '~/app/types/employee/response/employee.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export type AccessEmployeeType = {
    id: number
    employeeId: number
    employee: EmployeeType
}

export const emAccessQueryApi = {
    getAllEmAccess: async () => {
        const url = '/v1/beauty/EmployeeAccess'
        const response = await http.get(url)
        return response.data as AccessEmployeeType[]
    },
    getEmployeeById: async (id: number) => {
        const url = `/v1/hrm/Employee/${id}`

        const response = (await http.get(url)) as ResponseMessageType<EmployeeType>
        return response.data
    }
}
