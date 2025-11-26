import { ContractTypeType } from '~/app/types/contract-type/response/contract-type.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const contractTypeQueryApi = {
    getAllContractType: async () => {
        const url = '/v1/hrm/ContractType'
        const response = (await http.get(url)) as ResponseMessageType<ContractTypeType[]>
        return response.data
    },
    getContractTypeById: async (id: number) => {
        const url = `/v1/hrm/ContractType/${id}`
        const response = (await http.get(url)) as ResponseMessageType<ContractTypeType>
        return response.data
    }
}
