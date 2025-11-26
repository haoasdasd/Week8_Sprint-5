import http from '~/app/utils/http.util'
import { CreateMaritalRequestType, UpdateMaritalRequestType } from '~/app/types/marital/request/marital.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const maritalCommandApi = {
    createMarital: async (body: CreateMaritalRequestType) => {
        const url = '/v1/hrm/Marital'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateMarital: async (id: number, body: UpdateMaritalRequestType) => {
        const url = `/v1/hrm/Marital/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteMarital: async (id: number) => {
        const url = `/v1/hrm/Marital/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
