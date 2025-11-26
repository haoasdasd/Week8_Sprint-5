import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const contractTypeSchema = yup.object().shape({
    contractTypeCode: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max32Characters.length, VALIDATE.max32Characters.message),
    contractTypeName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max256Characters.length, VALIDATE.max256Characters.message)
})

export type ContractTypeSchemaType = yup.InferType<typeof contractTypeSchema>
