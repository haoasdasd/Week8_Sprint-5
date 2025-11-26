import { HourPerDayType } from '~/app/types/hour-per-day/response/hour-per-day.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const hourPerDayQueryApi = {
    getAllHourPerDay: async () => {
        const url = '/v1/hrm/HourPerDay'
        const response = (await http.get(url)) as ResponseMessageType<HourPerDayType[]>
        return response.data
    },
    getHourPerDayById: async (id: number) => {
        const url = `/v1/hrm/HourPerDay/${id}`
        const response = (await http.get(url)) as ResponseMessageType<HourPerDayType>
        return response.data
    }
}
