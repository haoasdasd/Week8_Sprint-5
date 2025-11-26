import { ResponseMessageType } from '~/app/types/utils/response.type'
import {
    CreateWebLocalWardRequestType,
    UpdateWebLocalWardRequestType
} from '~/app/types/web-local-ward/request/web-local-ward.type'
import http from '~/app/utils/http.util'

export const webLocalWardCommandApi = {
    createWebLocalWard: async (body: CreateWebLocalWardRequestType) => {
        const url = '/v1/define/WebLocalWard'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateWebLocalWard: async (id: number, body: UpdateWebLocalWardRequestType) => {
        const url = `/v1/define/WebLocalWard/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteWebLocalWard: async (id: number) => {
        const url = `/v1/define/WebLocalWard/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
