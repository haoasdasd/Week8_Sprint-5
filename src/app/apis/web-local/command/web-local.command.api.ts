import { ResponseMessageType } from '~/app/types/utils/response.type'
import { CreateWebLocalRequestType, UpdateWebLocalRequestType } from '~/app/types/web-local/request/web-local.type'
import http from '~/app/utils/http.util'

export const webLocalCommandApi = {
    createWebLocal: async (body: CreateWebLocalRequestType) => {
        const url = '/v1/define/WebLocal'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateWebLocal: async (id: string, body: UpdateWebLocalRequestType) => {
        const url = `/v1/define/WebLocal/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteWebLocal: async (id: string) => {
        const url = `/v1/define/WebLocal/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
