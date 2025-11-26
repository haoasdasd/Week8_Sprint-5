import { LoginRequestType } from '~/app/types/auth/request/auth.type'
import { LoginResponseType } from '~/app/types/auth/response/auth.type'
import http from '~/app/utils/http.util'

export const authCommandApi = {
    login: async (body: LoginRequestType) => {
        const url = '/v1/sys/Account'
        const response = (await http.post(url, body)) as LoginResponseType
        return response
    }
}
