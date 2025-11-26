import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const provinceSchema = yup.object().shape({
    provinceName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max32Characters.length, VALIDATE.max32Characters.message),
    provinceNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max32Characters.length, VALIDATE.max32Characters.message),
    provinceFullName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    provinceFullNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    provinceLatitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    provinceLongitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    keyLocalization: yup
        .string()
        .required(VALIDATE.required.message)
        .max(VALIDATE.max32Characters.length, VALIDATE.max32Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message)
})

export type WebLocalProvinceSchemaType = yup.InferType<typeof provinceSchema>
