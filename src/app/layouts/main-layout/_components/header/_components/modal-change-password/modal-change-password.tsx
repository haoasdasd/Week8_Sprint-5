import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Col, Form, Row } from 'reactstrap'
import { employeeCommandApi } from '~/app/apis/employee/command/employee.command.api'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { changePasswordSchema } from '~/app/schemas/change-password.schema'
import useAuthStore from '~/app/shared/auth.shared'
import { useStorePopup } from '~/app/shared/popup.shared'
import { ChangePasswordEmployeeRequestType } from '~/app/types/employee/request/employee.type'

interface ModalChangePasswordProps {
    modal: boolean
    toggle: () => void
}

export default function ModalChangePassword({ modal, toggle }: ModalChangePasswordProps) {
    const { profileEmployee } = useAuthStore()
    const { getLangKey } = useLang()
    const { messageSuccess, messageError } = useToastMessageAsync()

    const { openModal, closeModal } = useStorePopup()

    const hanldePopupChangePassword = () => {
        const title = `Xác nhận thay đổi mật khẩu`
        const message = `Bạn có chắc chắn muốn thay đổi mật khẩu không?`
        openModal(title, message, handleSubmit(onSubmit))
    }

    const navigate = useNavigate()

    const mutationChangePassword = useMutation({
        mutationFn: ({ id, body }: { id: number; body: ChangePasswordEmployeeRequestType }) =>
            employeeCommandApi.changePassword(id, body)
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<ChangePasswordEmployeeRequestType>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordEmployeeRequestType> = (data) => {
        mutationChangePassword.mutate(
            { id: profileEmployee?.id || 0, body: data },
            {
                onSuccess: () => {
                    toggle()
                    sessionStorage.removeItem(STORAGE_KEY.SESSION_PROFILE)
                    // remove active menu
                    sessionStorage.removeItem(STORAGE_KEY.SESSION_STATE_LEVEL_0)
                    sessionStorage.removeItem(STORAGE_KEY.SESSION_STATE_LEVEL_1)
                    navigate('/login')
                    reset()
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_UPDATE_SUCCESSFULLY))
                },
                onError: (err) => {
                    console.log(err)
                    messageError('Mật khẩu cũ không đúng')
                },
                onSettled: () => {
                    closeModal()
                }
            }
        )
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            closeModal()
        }
    }, [errors])

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title='Thay đổi mật khẩu'
            titleFooter='Đổi mật khẩu'
            onSubmit={hanldePopupChangePassword}
        >
            <Form innerRef={formRef}>
                <Row className='gx-4 gy-4'>
                    <Col lg={12}>
                        <Input
                            icon={<i className='ri-lock-line'></i>}
                            type='password'
                            name='oldPassword'
                            control={control}
                            errors={errors}
                            horizontal
                            label='Mật khẩu cũ'
                            placeholder='Mật khẩu cũ'
                        />
                    </Col>
                    <Col lg={12}>
                        <Input
                            icon={<i className='ri-lock-line'></i>}
                            type='password'
                            name='newPassword'
                            control={control}
                            errors={errors}
                            horizontal
                            label='Mật khẩu mới'
                            placeholder='Mật khẩu mới'
                        />
                    </Col>
                    <Col lg={12}>
                        <Input
                            icon={<i className='ri-lock-line'></i>}
                            type='password'
                            name='confirmNewPassword'
                            control={control}
                            errors={errors}
                            horizontal
                            label='Xác nhận mật khẩu mới'
                            placeholder='Xác nhận mật khẩu mới'
                        />
                    </Col>
                </Row>
            </Form>
        </ModalCommon>
    )
}
