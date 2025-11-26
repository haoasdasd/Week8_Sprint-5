import * as yup from 'yup'
import { VALIDATE } from '~/app/constants/validate.constant'

export const changePasswordSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    newPassword: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message),
    confirmNewPassword: yup
        .string()
        .typeError(VALIDATE.required.message)
        .required(VALIDATE.required.message)
        .max(VALIDATE.max128Characters.length, VALIDATE.max128Characters.message)
        .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

export type ChangePasswordSchemaType = yup.InferType<typeof changePasswordSchema>
