import { GetAllCompanyRequestType } from '~/app/types/company/request/company.type'
import { CompanyType } from '~/app/types/company/response/company.type'
import { ApiQueryPaginationResponseType } from '~/app/types/utils/api.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const companyQueryApi = {
    getAllCompany: async (params?: GetAllCompanyRequestType) => {
        const url = '/v1/define/Company'
        const response = await http.get(url, { params })
        if (params?.pageNumber && params?.pageSize) {
            return response.data as ApiQueryPaginationResponseType<CompanyType[]>
        }
        return response.data as CompanyType[]
    },
    getCompanyById: async (id: number) => {
        const url = `/v1/define/Company/${id}`
        const response = (await http.get(url)) as ResponseMessageType<CompanyType>
        return response.data
    }
}
