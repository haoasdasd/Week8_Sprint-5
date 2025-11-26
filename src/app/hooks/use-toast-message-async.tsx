import { toast } from 'react-toastify'

export const useToastMessageAsync = () => {
    const messageSuccess = (MESSAGE: string) => {
        toast.success(MESSAGE, { position: 'top-right', autoClose: 3000 })
    }
    const messageWarning = (MESSAGE: string) => {
        toast.warning(MESSAGE, { position: 'top-right', autoClose: 3000 })
    }

    const messageError = (MESSAGE: string) => {
        toast.error(MESSAGE, { position: 'top-right', autoClose: 3000 })
    }

    return { messageSuccess, messageError, messageWarning }
}
