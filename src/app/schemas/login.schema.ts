import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    password: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message)
})

export type LoginSchemaType = yup.InferType<typeof loginSchema>
