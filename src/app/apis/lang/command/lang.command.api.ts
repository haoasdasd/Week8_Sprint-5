import { CreateLangRequestType, UpdateLangRequestType } from '~/app/types/lang/request/lang.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

const url = '/v1/define/Langs'

export const langCommandApi = {
    createLang: async (body: CreateLangRequestType) => {
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateLang: async (id: string, body: UpdateLangRequestType) => {
        const response = (await http.put(`${url}/${id}`, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteLang: async (id: string) => {
        const response = (await http.delete(`${url}/${id}`)) as ResponseMessageType<null>
        return response.data
    }
}
