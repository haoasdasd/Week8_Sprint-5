import { ResponseMessageType } from '~/app/types/utils/response.type'
import { GetAllWebLocalDistrictRequestType } from '~/app/types/web-local-district/request/web-local-district.type'
import { WebLocalDistrictType } from '~/app/types/web-local-district/response/web-local-district.type'

import http from '~/app/utils/http.util'

export const webLocalDistrictQueryApi = {
    getAllWebLocalDistrict: async (body: GetAllWebLocalDistrictRequestType) => {
        const url = '/v1/define/WebLocalDistrict'
        const response = (await http.get(url, { params: body })) as ResponseMessageType<WebLocalDistrictType[]>
        return response.data
    },
    getWebLocalDistrictById: async (id: number) => {
        const url = `/v1/define/WebLocalDistrict/${id}`
        const response = (await http.get(url)) as ResponseMessageType<WebLocalDistrictType>
        return response.data
    }
}
