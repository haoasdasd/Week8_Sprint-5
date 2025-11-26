import http from '~/app/utils/http.util'
import { CreateReligionRequestType, UpdateReligionRequestType } from '~/app/types/religion/request/religion.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const religionCommandApi = {
    createReligion: async (body: CreateReligionRequestType) => {
        const url = '/v1/hrm/Religion'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateReligion: async (id: number, body: UpdateReligionRequestType) => {
        const url = `/v1/hrm/Religion/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteReligion: async (id: number) => {
        const url = `/v1/hrm/Religion/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
