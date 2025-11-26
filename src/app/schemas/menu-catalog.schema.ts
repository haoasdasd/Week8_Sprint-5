import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const menuCataloglSchema = yup.object().shape({
    menuPid: yup.number().typeError(VALIDATE.required.message).required(VALIDATE.required.message),
    menuName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuNameEn: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuLink: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuOrder: yup
        .number()
        .typeError(VALIDATE.required.message)
        .min(VALIDATE.min1Character.length, VALIDATE.min1Character.message)
        .required(VALIDATE.required.message),
    isActived: yup.boolean().required(VALIDATE.required.message)
})
export const updateMenucatalogSchema = yup.object().shape({
    menuName: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuNameEn: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuLink: yup
        .string()
        .typeError(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    menuOrder: yup.number().typeError(VALIDATE.required.message),
    isActived: yup.boolean()
})

export type MenuCataloglSchemaType = yup.InferType<typeof menuCataloglSchema>
