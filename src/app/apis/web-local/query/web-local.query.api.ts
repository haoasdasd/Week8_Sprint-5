import { ResponseMessageType } from '~/app/types/utils/response.type'
import { WebLocalType } from '~/app/types/web-local/response/web-local.type'
import http from '~/app/utils/http.util'

export const webLocalQueryApi = {
    getAllWebLocal: async () => {
        const url = '/v1/define/WebLocal'
        const response = (await http.get(url)) as ResponseMessageType<WebLocalType[]>
        return response.data
    },
    getLocalById: async (id: string) => {
        const url = `/v1/define/WebLocal/${id}`
        const response = (await http.get(url)) as ResponseMessageType<WebLocalType>
        return response.data
    }
}
