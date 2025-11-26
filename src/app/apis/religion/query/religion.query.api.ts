import http from '~/app/utils/http.util'
import { ReligionType } from '~/app/types/religion/response/religion.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const religionQueryApi = {
    getAllReligion: async () => {
        const url = '/v1/hrm/Religion'
        const response = (await http.get(url)) as ResponseMessageType<ReligionType[]>
        return response.data
    },
    getReligionById: async (id: number) => {
        const url = `/v1/hrm/Religion/${id}`
        const response = (await http.get(url)) as ResponseMessageType<ReligionType>
        return response.data
    }
}
