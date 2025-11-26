import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const employeeRoleSchema = yup.object().shape({
    empRoleName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max256Characters.length, VALIDATE.max256Characters.message),
    empRoleCode: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max32Characters.length, VALIDATE.max32Characters.message)
})

export type EmployeeRoleSchemaType = yup.InferType<typeof employeeRoleSchema>
