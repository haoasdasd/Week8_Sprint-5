import { LoginResponseType } from '~/app/types/auth/response/auth.type'
import {
    CreateCompanyRequestType,
    LoginCompanyRequestType,
    UpdateCompanyRequestType
} from '~/app/types/company/request/company.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const companyCommandApi = {
    createCompany: async (body: CreateCompanyRequestType) => {
        const url = '/v1/define/Company'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateCompany: async (id: number, body: UpdateCompanyRequestType) => {
        const url = `/v1/define/Company/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteCompany: async (id: number) => {
        const url = `/v1/define/Company/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    },
    loginCompany: async (body: LoginCompanyRequestType) => {
        const url = '/v1/define/Company/login'
        const response = (await http.post(url, body)) as LoginResponseType
        return response
    }
}
