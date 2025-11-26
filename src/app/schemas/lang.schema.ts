import * as yup from 'yup'
import { VALIDATE } from '../constants/validate.constant'

export const langSchema = yup.object().shape({
    id: yup.string().required(VALIDATE.required.message).max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    langVN: yup
        .string()
        .required(VALIDATE.required.message)
        .max(VALIDATE.max512Characters.length, VALIDATE.max512Characters.message),
    langEN: yup
        .string()
        .required(VALIDATE.required.message)
        .max(VALIDATE.max512Characters.length, VALIDATE.max512Characters.message),
    langDescription: yup
        .string()
        .required(VALIDATE.required.message)
        .max(VALIDATE.max512Characters.length, VALIDATE.max512Characters.message)
})

export type langSchemaType = yup.InferType<typeof langSchema>
