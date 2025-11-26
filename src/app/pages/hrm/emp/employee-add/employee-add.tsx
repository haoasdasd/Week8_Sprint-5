/* eslint-disable react/no-children-prop */
import { Fragment } from 'react/jsx-runtime'
import { useStorePopup } from '~/app/shared/popup.shared'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardTitle, Col, Form, Row } from 'reactstrap'
import { CreateEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { employeeSchema } from '~/app/schemas/employee.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import Input from '~/app/components/input-component'
import ImageUpload from '~/app/components/image-upload-component'
import DatePicker from '~/app/components/date-picker-component'
import SelectSingle from '~/app/components/select/select-single-component'
import { useEmployee } from '~/app/hooks/use-employee'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { employeeCommandApi } from '~/app/apis/employee/command/employee.command.api'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import Textarea from '~/app/components/textarea-component'
import { useStoreHeader } from '~/app/shared/header.shared'
import { toast } from 'react-toastify'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Skeleton from '~/app/components/skeleton-component'
import { useTooltip } from '~/app/hooks/useTooltip'
import { formatImageBase64, generateStrongPassword } from '~/app/utils/string.util'

export default function EmployeeAdd() {
    const { getLangKey, isLoadingLang } = useLang()
    const { openModal, closeModal } = useStorePopup()
    const { messageSuccess } = useToastMessageAsync()

    const { setSubmit, closeSubmit, setIsLoading } = useStoreHeader()

    const [copied, setCopied] = useState(false)
    // Tooltip gen password
    const [tooltipGenPassword, setTooltipGenPassword] = useState(false)
    const {
        getReferenceProps: getReferencePropsGenPassword,
        refs: refsGenPassword,
        divTooltip: divTooltipGenPassword
    } = useTooltip({
        showTooltip: tooltipGenPassword,
        onChangeTooltip: setTooltipGenPassword,
        placement: 'top',
        arrow: false,
        offsetNumber: 2,
        label: 'Tự động tạo mật khẩu'
    })

    // Tooltip gen copied
    const [tooltipCopied, setTooltipCopied] = useState(false)
    const {
        getReferenceProps: getReferencePropsCopied,
        refs: refsCopied,
        divTooltip: divTooltipCopied
    } = useTooltip({
        showTooltip: tooltipCopied,
        onChangeTooltip: setTooltipCopied,
        placement: 'bottom',
        arrow: false,
        offsetNumber: 1,
        label: 'Sao chép'
    })

    const navigate = useNavigate()
    const {
        listEmployeeRoles,
        listTrainingMajors,
        listDegrees,
        listBanks,
        listLocals,
        listProvinces,
        listDistricts,
        listWards,
        listMaritals,
        listNations,
        listReligions,
        listProvincesAll,
        selectedCountry,
        setSelectedCountry,
        listCompanies
    } = useEmployee()

    const { mutate, error } = useMutation({
        mutationFn: (body: CreateEmployeeRequestType) => employeeCommandApi.createEmployee(body)
    })

    const hanldeBack = () => {
        const title = `${getLangKey(CONFIG_LANG_KEY.ERP365_BACK)} ${getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE)}`
        const message = getLangKey(CONFIG_LANG_KEY.ERP365_MESSAGE_FIELD_NOT_SAVE)
        openModal(title, message, () => {
            navigate('/employee')
            closeModal()
            closeSubmit()
        })
    }

    const {
        control,
        setValue,
        watch,
        getValues,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateEmployeeRequestType>({
        resolver: yupResolver(employeeSchema),
        defaultValues: {
            empCitizenIdentity: '',
            empTaxCode: '',
            empCode: '',
            password: '',
            companyId: 0,
            empFirstName: '',
            empLastName: '',
            empGender: false,
            empBirthday: 0,
            empImageBase64: '',
            empPlaceOfBirth: 0,
            empTel: '',
            empEmail: '',
            empEducationLevel: '',
            empJoinedDate: 0,
            degreeId: 0,
            traMajId: 0,
            empAccountNumber: '',
            bankId: 0,
            nationId: 0,
            religionId: 0,
            maritalId: 0,
            empRoleId: 0,
            countryId: '',
            empPlaceOfResidenceAddress: '',
            empPlaceOfResidenceWardId: 0,
            isActived: 1
        }
    })

    const onSubmit: SubmitHandler<CreateEmployeeRequestType> = (data) => {
        setIsLoading(true)
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_PAGINATION_ALL] })
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_ALL] })
                messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
                navigate('/employee')
            },
            onError: () => {
                setIsLoading(false)
            }
        })
    }

    const handlePlaceOfBirthDate = (date: Date | null) => {
        if (date) {
            const timestampInSeconds = Math.floor(date.getTime() / 1000)
            setValue('empBirthday', timestampInSeconds, { shouldValidate: true })
        }
    }

    const handleJoinDate = (date: Date | null) => {
        if (date) {
            const timestampInSeconds = Math.floor(date.getTime() / 1000)
            setValue('empJoinedDate', timestampInSeconds, { shouldValidate: true })
        }
    }

    const handleImageBase64 = async (file: File) => {
        try {
            const base64 = await formatImageBase64(file)
            setValue('empImageBase64', base64, { shouldValidate: true })
        } catch (error) {
            console.error('Failed to convert image:', error)
        }
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    useEffect(() => {
        setSubmit(
            getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_CREATE_EMPLOYEE),
            () => {
                handleSubmit(onSubmit)()
            },
            hanldeBack
        )

        return () => {
            closeSubmit()
        }
    }, [isLoadingLang])

    useEffect(() => {
        if (error) {
            toast.error(getLangKey(error.message))
        }
    }, [error])

    return (
        <Fragment>
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col lg={8}>
                        <Card>
                            <CardTitle>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TAB_EMPLOYEE_INFORMATION)}</CardTitle>
                            <CardBody>
                                <Row className='gx-4 gy-2'>
                                    <Col lg={4}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column align-items-center gap-2 mb-3'>
                                                <Skeleton style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                                                <Skeleton style={{ width: '100px' }} />
                                            </div>
                                        ) : (
                                            <ImageUpload
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_IMAGE)}
                                                name='empImageBase64'
                                                errors={errors}
                                                onChange={handleImageBase64}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={8}>
                                        <Row className='gx-4 gy-2'>
                                            <Col lg={12}>
                                                {isLoadingLang ? (
                                                    <div className='d-flex flex-column  gap-1'>
                                                        <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                        <Skeleton className='mb-1' style={{ height: 40 }} />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_CODE)}
                                                        placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_CODE)}
                                                        control={control}
                                                        name='empCode'
                                                        errors={errors}
                                                    />
                                                )}
                                            </Col>
                                            <Col lg={12}>
                                                {isLoadingLang ? (
                                                    <div className='d-flex flex-column gap-1'>
                                                        <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                        <Skeleton className='mb-1' style={{ height: 40 }} />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        labelIcon={
                                                            <Fragment>
                                                                <i
                                                                    ref={refsGenPassword.setReference}
                                                                    {...getReferencePropsGenPassword()}
                                                                    className={'ri-loop-left-line'}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() =>
                                                                        setValue('password', generateStrongPassword(), {
                                                                            shouldValidate: true
                                                                        })
                                                                    }
                                                                />
                                                                {tooltipGenPassword && divTooltipGenPassword}
                                                            </Fragment>
                                                        }
                                                        label={getLangKey(CONFIG_LANG_KEY.ERP365_PASSWORD)}
                                                        placeholder={getLangKey(CONFIG_LANG_KEY.ERP365_PLACEHOLDER_PASSWORD)}
                                                        control={control}
                                                        icon={
                                                            <Fragment>
                                                                <i
                                                                    ref={refsCopied.setReference}
                                                                    {...getReferencePropsCopied()}
                                                                    className={copied ? 'ri-check-line' : 'ri-file-copy-line'}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        opacity: watch('password') ? 1 : 0.5,
                                                                        color: copied ? 'var(--success-color)' : ''
                                                                    }}
                                                                    onClick={() => {
                                                                        if (watch('password')) {
                                                                            setCopied(true)
                                                                            navigator.clipboard.writeText(getValues('password'))
                                                                            setTimeout(() => {
                                                                                setCopied(false)
                                                                            }, 2000)
                                                                        }
                                                                    }}
                                                                />
                                                                {tooltipCopied && divTooltipCopied}
                                                            </Fragment>
                                                        }
                                                        rightIcon
                                                        name='password'
                                                        type='password'
                                                        errors={errors}
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <Input
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_FIRSTNAME)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_FIRSTNAME)}
                                                control={control}
                                                name='empFirstName'
                                                errors={errors}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <Input
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_LASTNAME)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_LASTNAME)}
                                                control={control}
                                                name='empLastName'
                                                errors={errors}
                                            />
                                        )}
                                    </Col>

                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <Input
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_EMAIL)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_EMAIL)}
                                                control={control}
                                                name='empEmail'
                                                errors={errors}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        <SelectSingle
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.ERP365_COMPANY)}
                                            name='companyId'
                                            errors={errors}
                                            initialOptions={listCompanies ?? []}
                                            onChange={(e) => {
                                                setValue('companyId', Number(e?.value), { shouldValidate: true })
                                            }}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <Input
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_TEL)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_TEL)}
                                                control={control}
                                                name='empTel'
                                                errors={errors}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <DatePicker
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_DATE_OF_BIRTH)}
                                                name='empBirthday'
                                                errors={errors}
                                                onChange={handlePlaceOfBirthDate}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <SelectSingle
                                                horizontal
                                                name='empGender'
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_GENDER)}
                                                errors={errors}
                                                selected={'0'}
                                                initialOptions={[
                                                    { label: getLangKey(CONFIG_LANG_KEY.ERP365_MALE), value: String(0) },
                                                    { label: getLangKey(CONFIG_LANG_KEY.ERP365_FEMALE), value: String(1) }
                                                ]}
                                                onChange={(e) => setValue('empGender', e?.value === '0' ? false : true)}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <SelectSingle
                                                horizontal
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_PLACE_OF_BIRTH)}
                                                name='empPlaceOfBirth'
                                                errors={errors}
                                                initialOptions={listProvincesAll ?? []}
                                                onChange={(e) =>
                                                    setValue('empPlaceOfBirth', Number(e?.value), {
                                                        shouldValidate: true
                                                    })
                                                }
                                            />
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        <Input
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_CI_ID)}
                                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_CI_ID)}
                                            control={control}
                                            name='empCitizenIdentity'
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <DatePicker
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_JOIN_DATE)}
                                            name='empJoinedDate'
                                            errors={errors}
                                            onChange={handleJoinDate}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <Input
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_EDUCATION_LEVEL)}
                                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_EDUCATION_LEVEL)}
                                            control={control}
                                            name='empEducationLevel'
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <SelectSingle
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.ERP365_MARITAL)}
                                            name='maritalId'
                                            errors={errors}
                                            initialOptions={listMaritals ?? []}
                                            onChange={(e) => {
                                                setValue('maritalId', Number(e?.value), { shouldValidate: true })
                                            }}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <SelectSingle
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.ERP365_NATION)}
                                            name='nationId'
                                            errors={errors}
                                            initialOptions={listNations ?? []}
                                            onChange={(e) => {
                                                setValue('nationId', Number(e?.value), { shouldValidate: true })
                                            }}
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <SelectSingle
                                            horizontal
                                            label={getLangKey(CONFIG_LANG_KEY.ERP365_RELIGION)}
                                            name='religionId'
                                            errors={errors}
                                            initialOptions={listReligions ?? []}
                                            onChange={(e) => {
                                                setValue('religionId', Number(e?.value), { shouldValidate: true })
                                            }}
                                        />
                                    </Col>
                                    <Col lg={12}>
                                        {isLoadingLang ? (
                                            <div className='d-flex flex-column  gap-1'>
                                                <Skeleton style={{ marginBottom: 5 }} />
                                                <Skeleton className='mb-1' style={{ height: 40 }} />
                                            </div>
                                        ) : (
                                            <Textarea
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_ADDRESS)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_ADDRES)}
                                                control={control}
                                                name='empPlaceOfResidenceAddress'
                                                errors={errors}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardTitle>{getLangKey(CONFIG_LANG_KEY.ERP365_LOCATION)}</CardTitle>
                                    <CardBody>
                                        <Row className='gx-4 gy-2'>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    horizontal
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_LOCAL)}
                                                    name='countryId'
                                                    errors={errors}
                                                    initialOptions={listLocals ?? []}
                                                    onChange={(e) => {
                                                        setSelectedCountry({
                                                            local: e?.value ?? '',
                                                            province: 0,
                                                            district: 0,
                                                            ward: 0
                                                        })
                                                        setValue('countryId', e?.value ?? '', { shouldValidate: true })
                                                        setValue('empPlaceOfResidenceWardId', 0)
                                                    }}
                                                />
                                            </Col>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    horizontal
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_PROVINCE)}
                                                    disabled={selectedCountry.local ? false : true}
                                                    initialOptions={listProvinces ?? []}
                                                    customError={
                                                        typeof errors['empPlaceOfResidenceWardId']?.message === 'string' &&
                                                        !selectedCountry.province
                                                            ? errors['empPlaceOfResidenceWardId']?.message
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        setSelectedCountry((prev) => ({
                                                            ...prev,
                                                            province: Number(e?.value) ?? 0,
                                                            district: 0,
                                                            ward: 0
                                                        }))
                                                        setValue('empPlaceOfResidenceWardId', 0)
                                                    }}
                                                />
                                            </Col>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    horizontal
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_DISTRICT)}
                                                    disabled={selectedCountry.province ? false : true}
                                                    initialOptions={listDistricts ?? []}
                                                    customError={
                                                        typeof errors['empPlaceOfResidenceWardId']?.message === 'string' &&
                                                        !selectedCountry.district
                                                            ? errors['empPlaceOfResidenceWardId']?.message
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        setSelectedCountry((prev) => ({
                                                            ...prev,
                                                            district: Number(e?.value) ?? 0,
                                                            ward: 0
                                                        }))
                                                        setValue('empPlaceOfResidenceWardId', 0)
                                                    }}
                                                />
                                            </Col>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    horizontal
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_WARD)}
                                                    name='empPlaceOfResidenceWardId'
                                                    errors={errors}
                                                    disabled={selectedCountry.district ? false : true}
                                                    initialOptions={listWards ?? []}
                                                    onChange={(e) => {
                                                        setSelectedCountry((prev) => ({
                                                            ...prev,
                                                            ward: Number(e?.value) ?? 0
                                                        }))
                                                        setValue('empPlaceOfResidenceWardId', Number(e?.value), {
                                                            shouldValidate: true
                                                        })
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={12}>
                                <Card>
                                    <CardTitle>{getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TAB_WORK_TAXES)}</CardTitle>
                                    <CardBody>
                                        <Row className='gx-4 gy-2'>
                                            <Col lg={6}>
                                                <Input
                                                    label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_TAX_CODE)}
                                                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_TAX_CODE)}
                                                    control={control}
                                                    name='empTaxCode'
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col lg={6}>
                                                <SelectSingle
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_DEGREE)}
                                                    name='degreeId'
                                                    errors={errors}
                                                    initialOptions={listDegrees ?? []}
                                                    onChange={(e) =>
                                                        setValue('degreeId', Number(e?.value), { shouldValidate: true })
                                                    }
                                                />
                                            </Col>
                                            <Col lg={6}>
                                                <SelectSingle
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE_ROLE)}
                                                    name='empRoleId'
                                                    errors={errors}
                                                    initialOptions={listEmployeeRoles ?? []}
                                                    onChange={(e) =>
                                                        setValue('empRoleId', Number(e?.value), { shouldValidate: true })
                                                    }
                                                />
                                            </Col>
                                            <Col lg={6}>
                                                <SelectSingle
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_TRAINING_MAJOR)}
                                                    name='traMajId'
                                                    errors={errors}
                                                    initialOptions={listTrainingMajors ?? []}
                                                    onChange={(e) =>
                                                        setValue('traMajId', Number(e?.value), { shouldValidate: true })
                                                    }
                                                />
                                            </Col>

                                            <Col lg={6}>
                                                <Input
                                                    label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_ACCOUNT_NUMBER)}
                                                    placeholder={getLangKey(
                                                        CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_ACCOUNT_NUMBER
                                                    )}
                                                    control={control}
                                                    name='empAccountNumber'
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col lg={6}>
                                                <SelectSingle
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_BANK)}
                                                    name='bankId'
                                                    errors={errors}
                                                    initialOptions={listBanks ?? []}
                                                    onChange={(e) =>
                                                        setValue('bankId', Number(e?.value), { shouldValidate: true })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
