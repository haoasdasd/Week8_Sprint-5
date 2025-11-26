import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const wardSchema = yup.object().shape({
    wardName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    wardNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max64Characters.length, VALIDATE.max64Characters.message),
    wardFullName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max96Characters.length, VALIDATE.max96Characters.message),
    wardFullNameEN: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max96Characters.length, VALIDATE.max96Characters.message),
    wardLatitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    wardLongitude: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message),
    districtId: yup
        .number()
        .typeError(VALIDATE.isNumber.message)
        .required(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message)
})

export type WebLocalWardSchemaType = yup.InferType<typeof wardSchema>
