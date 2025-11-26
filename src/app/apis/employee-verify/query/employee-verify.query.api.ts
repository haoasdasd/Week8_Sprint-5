import http from '~/app/utils/http.util'
import { EmployeeVerifyType } from '~/app/types/employee-verify/response/employee-verify.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const employeeVerifyQueryApi = {
    getAllEmployeeVerify: async () => {
        const url = '/v1/hrm/EmployeeVerify'
        const response = (await http.get(url)) as ResponseMessageType<EmployeeVerifyType[]>
        return response.data
    },
    getEmployeeVerifyById: async (id: number) => {
        const url = `/v1/hrm/EmployeeVerify/${id}`
        const response = (await http.get(url)) as ResponseMessageType<EmployeeVerifyType>
        return response.data
    }
}
