import * as yup from 'yup'
import { VALIDATE } from '../constants/validate.constant'

export const checkCompanySchema = yup.object().shape({
    ipNetworkDeclare: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    companyId: yup
        .number()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .notOneOf([0], VALIDATE.required.message),
    multiLogin: yup.number().typeError(VALIDATE.required.message).required(VALIDATE.required.message)
})

export type checkCompanySchemaType = yup.InferType<typeof checkCompanySchema>
