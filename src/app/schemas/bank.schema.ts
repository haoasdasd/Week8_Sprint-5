import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const bankSchema = yup.object().shape({
    bankName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message)
})

export type BankSchemaType = yup.InferType<typeof bankSchema>
