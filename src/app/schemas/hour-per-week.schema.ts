import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const hourPerWeekSchema = yup.object().shape({
    day: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message)
})

export type hourPerWeekSchemaType = yup.InferType<typeof hourPerWeekSchema>
