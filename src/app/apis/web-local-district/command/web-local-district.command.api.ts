import { ResponseMessageType } from '~/app/types/utils/response.type'
import {
    CreateWebLocalDistrictRequestType,
    UpdateWebLocalDistrictRequestType
} from '~/app/types/web-local-district/request/web-local-district.type'
import http from '~/app/utils/http.util'

export const webLocalDistrictCommandApi = {
    createWebLocalDistrict: async (body: CreateWebLocalDistrictRequestType) => {
        const url = '/v1/define/WebLocalDistrict'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateWebLocalDistrict: async (id: number, body: UpdateWebLocalDistrictRequestType) => {
        const url = `/v1/define/WebLocalDistrict/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteWebLocalDistrict: async (id: number) => {
        const url = `/v1/define/WebLocalDistrict/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
