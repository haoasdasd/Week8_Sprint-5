import http from '~/app/utils/http.util'
import {
    CreateTrainingMajorRequestType,
    UpdateTrainingMajorRequestType
} from '~/app/types/training-major/request/training-major.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const trainingMajorCommandApi = {
    createTrainingMajor: async (body: CreateTrainingMajorRequestType) => {
        const url = '/v1/hrm/TrainingMajor'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateTrainingMajor: async (id: number, body: UpdateTrainingMajorRequestType) => {
        const url = `/v1/hrm/TrainingMajor/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteTrainingMajor: async (id: number) => {
        const url = `/v1/hrm/TrainingMajor/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
