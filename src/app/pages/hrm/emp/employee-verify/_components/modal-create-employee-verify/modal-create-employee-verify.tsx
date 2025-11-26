import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Col, Form, Label, Row } from 'reactstrap'
import { employeeVerifyCommandApi } from '~/app/apis/employee-verify/command/employee-verify.command.api'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import ImageUpload from '~/app/components/image-upload-component'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import SelectSingle from '~/app/components/select/select-single-component'
import Switches from '~/app/components/switches-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { queryClient } from '~/app/query-client'
import { employeeVerifySchema } from '~/app/schemas/employee-verify.schema'
import { CreateEmployeeVerifyRequestType } from '~/app/types/employee-verify/request/employee-verify.type'
import { EmployeeType } from '~/app/types/employee/response/employee.type'
import { formatImageBase64 } from '~/app/utils/string.util'

interface ModalCreateEmployeeVerifyProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateEmployeeVerify({ modal, toggle }: ModalCreateEmployeeVerifyProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: employees } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_ALL],
        queryFn: () => employeeQueryApi.getAllEmployee()
    })
    const listEmployess = useMemo(
        () =>
            (employees as EmployeeType[])?.map((emp) => ({
                label: emp.empFirstName + ' ' + emp.empLastName,
                value: String(emp.id)
            })),
        [employees]
    )

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateEmployeeVerifyRequestType) => employeeVerifyCommandApi.createEmployeeVerify(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<CreateEmployeeVerifyRequestType>({
        resolver: yupResolver(employeeVerifySchema),
        defaultValues: {
            employeeId: 0,
            verImageBase64: '',
            userIdVerify: 0,
            verCreatedDate: 0,
            isActived: 1
        }
    })

    const onSubmit: SubmitHandler<CreateEmployeeVerifyRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMOLOYEE_VERIFY_ALL] })
                toggle()
                messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
                reset()
            }
        })
    }

    const handleImageBase64 = async (file: File) => {
        try {
            const base64 = await formatImageBase64(file)
            setValue('verImageBase64', base64)
        } catch (error) {
            console.error('Failed to convert image:', error)
        }
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_ADD_EV)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_CREATE_EV)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                <Row>
                    <Col lg={12}>
                        <div className='text-center'>
                            <div className='position-relative d-inline-block'>
                                <ImageUpload name='verImageBase64' errors={errors} onChange={handleImageBase64} />
                            </div>
                            <h5 className='fs-13 mt-3'>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_TITLE_INPUT_IMAGE)}</h5>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <Switches
                            useNumberCheck
                            label={getLangKey(CONFIG_LANG_KEY.ERP365_ACTIVED)}
                            control={control}
                            name='isActived'
                            errors={errors}
                        />
                    </Col>
                    <Col lg={6}>
                        <Input
                            label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_TITLE_INPUT_CODE)}
                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_PLACEHOLDER_CODE)}
                            control={control}
                            name='userIdVerify'
                            errors={errors}
                        />
                    </Col>

                    <Col lg={6}>
                        <Label>{getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE)}</Label>
                        <SelectSingle
                            name='employeeId'
                            errors={errors}
                            initialOptions={listEmployess ?? []}
                            onChange={(e) => {
                                setValue('employeeId', Number(e?.value) ?? 0, { shouldValidate: true })
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </ModalCommon>
    )
}
