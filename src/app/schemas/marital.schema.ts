import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const maritalSchema = yup.object().shape({
    maritalName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max256Characters.length, VALIDATE.max256Characters.message)
})

export type MaritalSchemaType = yup.InferType<typeof maritalSchema>
