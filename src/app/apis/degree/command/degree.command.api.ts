import http from '~/app/utils/http.util'
import { CreateDegreeRequestType, UpdateDegreeRequestType } from '~/app/types/degree/request/degree.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const degreeCommandApi = {
    createDegree: async (body: CreateDegreeRequestType) => {
        const url = '/v1/hrm/Degree'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateDegree: async (id: number, body: UpdateDegreeRequestType) => {
        const url = `/v1/hrm/Degree/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteDegree: async (id: number) => {
        const url = `/v1/hrm/Degree/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
