import { ResponseMessageType } from '~/app/types/utils/response.type'
import {
    CreateWebLocalProvinceRequestType,
    UpdateWebLocalProvinceRequestType
} from '~/app/types/web-local-province/request/web-local-province.type'
import http from '~/app/utils/http.util'

export const webLocalProvinceCommandApi = {
    createWebLocalProvince: async (body: CreateWebLocalProvinceRequestType) => {
        const url = '/v1/define/WebLocalProvince'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateWebLocalProvince: async (id: number, body: UpdateWebLocalProvinceRequestType) => {
        const url = `/v1/define/WebLocalProvince/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteWebLocalProvince: async (id: number) => {
        const url = `/v1/define/WebLocalProvince/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
