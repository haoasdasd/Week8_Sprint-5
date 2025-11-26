import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const companySchema = yup.object().shape({
    companyPid: yup.number().typeError(VALIDATE.isNumber.message).required(VALIDATE.required.message).nullable(),
    taxCode: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    password: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    name: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    imageBase64: yup.string().required(VALIDATE.required.message),
    tel: yup
        .string()
        .typeError(VALIDATE.required.message)
        .matches(VALIDATE.phomeNumberVN.regex, {
            message: VALIDATE.phomeNumberVN.message,
            excludeEmptyString: true
        })
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    email: yup
        .string()
        .typeError(VALIDATE.required.message)
        .email(VALIDATE.email.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    website: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    address: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    founder: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    ceo: yup.string().required(VALIDATE.required.message).max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    ceoImageBase64: yup.string(),
    ceoEmail: yup.string().email(VALIDATE.email.message).max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    ceoTel: yup
        .string()
        .typeError(VALIDATE.required.message)
        .matches(VALIDATE.phomeNumberVN.regex, {
            message: VALIDATE.phomeNumberVN.message,
            excludeEmptyString: true
        })
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    license: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    countryId: yup.string().typeError(VALIDATE.required.message).required(VALIDATE.required.message),
    wardId: yup
        .number()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.required.message),
    isActived: yup.boolean().required(VALIDATE.required.message),
    departmentIds: yup
        .array()
        .nullable()
        .of(yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message)),
    positionIds: yup
        .array()
        .nullable()
        .of(yup.number().required(VALIDATE.required.message).min(VALIDATE.min1Character.length, VALIDATE.required.message))
})

export const updateCompanySchema = companySchema.omit(['departmentIds', 'positionIds', 'password']).shape({
    imageBase64: yup.string()
})

export const loginCompanySchema = yup.object().shape({
    taxCode: yup
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

export type CompanySchemaType = yup.InferType<typeof companySchema>
