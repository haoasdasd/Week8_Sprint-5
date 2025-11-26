import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const employeeVerifySchema = yup.object().shape({
    employeeId: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message),
    verImageBase64: yup.string(),
    userIdVerify: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message),

    isActived: yup.number().required(VALIDATE.required.message)
})

export const updateEmployeeVerifySchema = employeeVerifySchema.shape({
    verCreatedDate: yup.number().typeError(VALIDATE.isNumber.message)
})

export type EmployeeVerifySchemaType = yup.InferType<typeof employeeVerifySchema>
