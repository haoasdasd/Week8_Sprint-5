import http from '~/app/utils/http.util'
import { CreateNationRequestType, UpdateNationRequestType } from '~/app/types/nation/request/nation.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const nationCommandApi = {
    createNation: async (body: CreateNationRequestType) => {
        const url = '/v1/hrm/Nation'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateNation: async (id: number, body: UpdateNationRequestType) => {
        const url = `/v1/hrm/Nation/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteNation: async (id: number) => {
        const url = `/v1/hrm/Nation/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
