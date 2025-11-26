import { HourPerWeekType } from '~/app/types/hour-per-week/response/hour-per-week.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const hourPerWeekQueryApi = {
    getAllHourPerWeek: async () => {
        const url = '/v1/hrm/HourPerWeek'
        const response = (await http.get(url)) as ResponseMessageType<HourPerWeekType[]>
        return response.data
    },
    getHourPerWeekById: async (id: number) => {
        const url = `/v1/hrm/HourPerWeek/${id}`
        const response = (await http.get(url)) as ResponseMessageType<HourPerWeekType>
        return response.data
    }
}
