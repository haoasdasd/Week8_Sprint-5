import { DegreeType } from '~/app/types/degree/response/degree.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const degreeQueryApi = {
    getAllDegree: async () => {
        const url = '/v1/hrm/Degree'
        const response = (await http.get(url)) as ResponseMessageType<DegreeType[]>
        return response.data
    },
    getDegreeById: async (id: number) => {
        const url = `/v1/hrm/Degree/${id}`
        const response = (await http.get(url)) as ResponseMessageType<DegreeType>
        return response.data
    }
}
