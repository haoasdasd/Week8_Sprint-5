import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const districtSchema = yup.object().shape({
    districtName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    districtNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    districtFullName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max96Characters.length, VALIDATE.max96Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    districtFullNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max96Characters.length, VALIDATE.max96Characters.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    districtLatitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    districtLongitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    provinceId: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message)
})

export type WebLocalDistrictSchemaType = yup.InferType<typeof districtSchema>
