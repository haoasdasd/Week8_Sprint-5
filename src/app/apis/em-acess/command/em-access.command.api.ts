import { LoginResponseType } from '~/app/types/auth/response/auth.type'
import { LoginEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import http from '~/app/utils/http.util'

export const emAccessCommandApi = {
    loginEmployee: async (body: LoginEmployeeRequestType) => {
        const url = '/v1/beauty/EmployeeAccess/Login'
        const response = (await http.post(url, body)) as LoginResponseType
        return response
    }
}
