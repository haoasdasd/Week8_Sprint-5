import { ResponseMessageType } from '~/app/types/utils/response.type'
import { GetAllWebLocalProvinceRequestType } from '~/app/types/web-local-province/request/web-local-province.type'
import { WebLocalProvinceType } from '~/app/types/web-local-province/response/web-local-province.type'

import http from '~/app/utils/http.util'

export const webLocalProvinceQueryApi = {
    getAllWebLocalProvince: async (body: GetAllWebLocalProvinceRequestType) => {
        const url = '/v1/define/WebLocalProvince'
        const response = (await http.get(url, { params: body })) as ResponseMessageType<WebLocalProvinceType[]>
        return response.data
    },
    getWebLocalProvinceById: async (id: number) => {
        const url = `/v1/define/WebLocalProvince/${id}`
        const response = (await http.get(url)) as ResponseMessageType<WebLocalProvinceType>
        return response.data
    }
}
