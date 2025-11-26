import { BankType } from '~/app/types/bank/response/bank.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const bankQueryApi = {
    getAllBank: async () => {
        const url = '/v1/hrm/Bank'
        const response = (await http.get(url)) as ResponseMessageType<BankType[]>
        return response.data
    },
    getBankById: async (id: number) => {
        const url = `/v1/hrm/Bank/${id}`
        const response = (await http.get(url)) as ResponseMessageType<BankType>
        return response.data
    }
}
