import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const employeeSchema = yup.object().shape({
    empCitizenIdentity: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .matches(VALIDATE.citizenIdVN.regex, VALIDATE.citizenIdVN.message),
    empTaxCode: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    empCode: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    password: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max256Characters.length, VALIDATE.max256Characters.message),
    empFirstName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    empLastName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message),
    empGender: yup.boolean().required(VALIDATE.required.message),
    empBirthday: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message),
    empImageBase64: yup.string().required(VALIDATE.required.message),
    empPlaceOfBirth: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message)
        .required(VALIDATE.required.message),
    empTel: yup
        .string()
        .typeError(VALIDATE.required.message)
        .matches(VALIDATE.phomeNumberVN.regex, VALIDATE.phomeNumberVN.message)
        .required(VALIDATE.required.message),
    empEmail: yup
        .string()
        .typeError(VALIDATE.required.message)
        .email(VALIDATE.email.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    empEducationLevel: yup.string(),
    empJoinedDate: yup.number(),
    degreeId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    traMajId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    empAccountNumber: yup.string().typeError(VALIDATE.required.message),
    bankId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    nationId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    religionId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    maritalId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    empRoleId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    countryId: yup.string().typeError(VALIDATE.required.message).required(VALIDATE.required.message),
    companyId: yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message),
    empPlaceOfResidenceAddress: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    empPlaceOfResidenceWardId: yup
        .number()
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message),
    isActived: yup.number().required(VALIDATE.required.message)
})

export const employeeUpdateSchema = employeeSchema.shape(
    Object.fromEntries(
        Object.entries(employeeSchema.fields).map(([key, field]) => {
            if (field instanceof yup.Schema) {
                return [key, field.notRequired()]
            } else {
                throw new Error(`Field ${key} is not a yup schema`)
            }
        })
    )
)

export const loginEmployeeSchema = yup.object().shape({
    empCode: yup
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

export type EmployeeSchemaType = yup.InferType<typeof employeeSchema>
export type EmployeeUpdateSchemaType = yup.InferType<typeof employeeUpdateSchema>
