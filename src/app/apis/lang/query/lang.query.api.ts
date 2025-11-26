import { LangType } from '~/app/types/lang/response/lang.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

const url = '/v1/define/Langs'

export const langQueryApi = {
    getAllLang: async () => {
        const response = (await http.get(url)) as ResponseMessageType<LangType[]>
        return response.data
    },
    getLangById: async (id: string) => {
        const response = (await http.get(`${url}/${id}`)) as ResponseMessageType<LangType>
        return response.data
    }
}
