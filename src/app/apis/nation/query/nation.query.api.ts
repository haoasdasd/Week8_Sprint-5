import http from '~/app/utils/http.util'
import { NationType } from '~/app/types/nation/response/nation.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const nationQueryApi = {
    getAllNation: async () => {
        const url = '/v1/hrm/Nation'
        const response = (await http.get(url)) as ResponseMessageType<NationType[]>
        return response.data
    },
    getNationById: async (id: number) => {
        const url = `/v1/hrm/Nation/${id}`
        const response = (await http.get(url)) as ResponseMessageType<NationType>
        return response.data
    }
}
