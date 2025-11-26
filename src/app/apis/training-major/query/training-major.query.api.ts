import http from '~/app/utils/http.util'
import { TrainingMajorType } from '~/app/types/training-major/response/training-major.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const trainingMajorQueryApi = {
    getAllTrainingMajor: async () => {
        const url = '/v1/hrm/TrainingMajor'
        const response = (await http.get(url)) as ResponseMessageType<TrainingMajorType[]>
        return response.data
    },
    getTrainingMajorById: async (id: number) => {
        const url = `/v1/hrm/TrainingMajor/${id}`
        const response = (await http.get(url)) as ResponseMessageType<TrainingMajorType>
        return response.data
    }
}
