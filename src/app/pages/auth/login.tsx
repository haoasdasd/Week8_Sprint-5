import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames/bind'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { employeeCommandApi } from '~/app/apis/employee/command/employee.command.api'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import erpVector from '~/app/assets/images/bgs/erp-vector.png'
import Button from '~/app/components/button/button-component'
import Input from '~/app/components/input-component'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { loginEmployeeSchema } from '~/app/schemas/employee.schema'
import useAuthStore from '~/app/shared/auth.shared'
import { LoginEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import styles from './login.module.scss'

const cx = classNames.bind(styles)

export default function Login() {
    const navigate = useNavigate()
    const {
        control,

        handleSubmit,
        formState: { errors }
    } = useForm<LoginEmployeeRequestType>({
        resolver: yupResolver(loginEmployeeSchema)
    })
    const { t } = useTranslation()
    const formRef = useRef<HTMLFormElement>(null)
    const { setProfileEmployee } = useAuthStore()

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: employeeCommandApi.loginEmployee
    })
    useKeydownForm(formRef)

    const onSubmit: SubmitHandler<LoginEmployeeRequestType> = (data) => {
        loginMutation.mutate(data, {
            onSuccess: async (data) => {
                // Temp fix
                toast.success('Đăng nhập thành công')
                // Save profile to session storage
                sessionStorage.setItem(STORAGE_KEY.SESSION_PROFILE, JSON.stringify(data))
                const response = await employeeQueryApi.getEmployeeById(data.id)

                setProfileEmployee(response)
                // Redirect to home page
                navigate('/employee')
            },
            onError: () => {
                toast.error('Tên đăng nhập hoặc mật khẩu không chính xác')
            }
        })
    }

    return (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 d-flex align-items-center justify-content-center'>
                        <img src={erpVector} alt='Login image' className='img-fluid' />
                    </div>

                    <div className='bg-white col-md-6 rounded-2 d-flex align-items-center justify-content-center'>
                        <div className='px-4 py-5 rounded' style={{ width: '400px' }}>
                            <h2 className='text-center mb-4'>{t('Đăng nhập vào hệ thống')}</h2>
                            <p className='text-center mb-4'>{t('Vui lòng nhập thông tin để đăng nhập')}</p>
                            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                                <Input
                                    placeholder={t('Tên đăng nhập')}
                                    label={t('Tên đăng nhập')}
                                    control={control}
                                    name='empCode'
                                    errors={errors}
                                    className={cx('input')}
                                />
                                <Input
                                    placeholder={t('Mật khẩu')}
                                    label={t('Mật khẩu')}
                                    control={control}
                                    name='password'
                                    type='password'
                                    errors={errors}
                                    className={cx('input')}
                                />
                                <Button
                                    isLoading={loginMutation.isPending}
                                    type='submit'
                                    disabled={loginMutation.isPending}
                                    className={cx('customBtn', 'btn btn-lg w-100 mt-3')}
                                >
                                    {loginMutation.isPending ? t('Đang đăng nhập') : t('Đăng nhập')}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
