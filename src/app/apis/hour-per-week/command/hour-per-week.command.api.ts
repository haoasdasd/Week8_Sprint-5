import { CreateHourPerWeekRequestType, UpdateHourPerWeekRequestType } from '~/app/types/hour-per-week/request/hour-per-week.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const hourPerWeekCommandApi = {
    createHourPerWeek: async (body: CreateHourPerWeekRequestType) => {
        const url = '/v1/hrm/HourPerWeek'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateHourPerWeek: async (id: number, body: UpdateHourPerWeekRequestType) => {
        const url = `/v1/hrm/HourPerWeek/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteHourPerWeek: async (id: number) => {
        const url = `/v1/hrm/HourPerWeek/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
