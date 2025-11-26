import { CreateHourPerDayRequestType, UpdateHourPerDayRequestType } from '~/app/types/hour-per-day/request/hour-per-day.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const hourPerDayCommandApi = {
    createHourPerDay: async (body: CreateHourPerDayRequestType) => {
        const url = '/v1/hrm/HourPerDay'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateHourPerDay: async (id: number, body: UpdateHourPerDayRequestType) => {
        const url = `/v1/hrm/HourPerDay/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteHourPerDay: async (id: number) => {
        const url = `/v1/hrm/HourPerDay/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
