import { ResponseMessageType } from '~/app/types/utils/response.type'
import { GetAllWebLocalWardRequestType } from '~/app/types/web-local-ward/request/web-local-ward.type'
import { WebLocalWardType } from '~/app/types/web-local-ward/response/web-local-ward.type'

import http from '~/app/utils/http.util'

export const webLocalWardQueryApi = {
    getAllWebLocalWard: async (body: GetAllWebLocalWardRequestType) => {
        const url = '/v1/define/WebLocalWard'
        const response = (await http.get(url, { params: body })) as ResponseMessageType<WebLocalWardType[]>
        return response.data
    },
    getWebLocalWardById: async (id: number) => {
        const url = `/v1/define/WebLocalWard/${id}`
        const response = (await http.get(url)) as ResponseMessageType<WebLocalWardType>
        return response.data
    }
}
