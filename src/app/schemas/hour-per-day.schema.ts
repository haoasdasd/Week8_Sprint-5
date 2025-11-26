import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const hourPerDaySchema = yup.object().shape({
    day: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    timeFrom: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    timeTo: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message)
})

export type HourPerDaySchemaType = yup.InferType<typeof hourPerDaySchema>
