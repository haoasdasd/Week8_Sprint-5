import http from '~/app/utils/http.util'
import {
    CreateContractTypeRequestType,
    UpdateContractTypeRequestType
} from '~/app/types/contract-type/request/contract-type.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const contractTypeCommandApi = {
    createContractType: async (body: CreateContractTypeRequestType) => {
        const url = '/v1/hrm/ContractType'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateContractType: async (id: number, body: UpdateContractTypeRequestType) => {
        const url = `/v1/hrm/ContractType/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteContractType: async (id: number) => {
        const url = `/v1/hrm/ContractType/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
