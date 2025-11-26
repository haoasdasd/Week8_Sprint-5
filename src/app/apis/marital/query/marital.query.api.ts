import http from '~/app/utils/http.util'
import { MaritalType } from '~/app/types/marital/response/marital.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const maritalQueryApi = {
    getAllMarital: async () => {
        const url = '/v1/hrm/Marital'
        const response = (await http.get(url)) as ResponseMessageType<MaritalType[]>
        return response.data
    },
    getMaritalById: async (id: number) => {
        const url = `/v1/hrm/Marital/${id}`
        const response = (await http.get(url)) as ResponseMessageType<MaritalType>
        return response.data
    }
}
