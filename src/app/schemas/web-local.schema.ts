import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const localSchema = yup.object().shape({
    id: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .transform((value) => value.toUpperCase())
        .matches(VALIDATE.noWhitespace.regex, VALIDATE.noWhitespace.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    localization: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .matches(VALIDATE.noSpecialCharacters.regex, VALIDATE.noSpecialCharacters.message),
    isActived: yup.boolean().required(VALIDATE.required.message)
})

export type WebLocalSchemaType = yup.InferType<typeof localSchema>
