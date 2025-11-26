import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const nationSchema = yup.object().shape({
    nationName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max24Characters.length, VALIDATE.max24Characters.message)
})

export type NationSchemaType = yup.InferType<typeof nationSchema>
