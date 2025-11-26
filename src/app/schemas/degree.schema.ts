import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const degreeSchema = yup.object().shape({
    degreeName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max256Characters.length, VALIDATE.max256Characters.message)
})

export type DegreeSchemaType = yup.InferType<typeof degreeSchema>
