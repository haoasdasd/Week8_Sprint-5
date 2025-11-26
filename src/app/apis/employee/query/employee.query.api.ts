import http from '~/app/utils/http.util'
import { EmployeeType } from '~/app/types/employee/response/employee.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import { GetAllEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import { ApiQueryPaginationResponseType } from '~/app/types/utils/api.type'

export const employeeQueryApi = {
    getAllEmployee: async (params?: GetAllEmployeeRequestType) => {
        const url = '/v1/hrm/Employee'
        const response = await http.get(url, { params })
        if (params?.pageNumber && params?.pageSize) {
            return response.data as ApiQueryPaginationResponseType<EmployeeType[]>
        }
        return response.data as EmployeeType[]
    },
    getEmployeeById: async (id: number) => {
        const url = `/v1/hrm/Employee/${id}`
        const response = (await http.get(url)) as ResponseMessageType<EmployeeType>
        return response.data
    }
}
