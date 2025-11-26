import { CreateBankRequestType, UpdateBankRequestType } from '~/app/types/bank/request/bank.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const bankCommandApi = {
    createBank: async (body: CreateBankRequestType) => {
        const url = '/v1/hrm/Bank'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateBank: async (id: number, body: UpdateBankRequestType) => {
        const url = `/v1/hrm/Bank/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteBank: async (id: number) => {
        const url = `/v1/hrm/Bank/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
