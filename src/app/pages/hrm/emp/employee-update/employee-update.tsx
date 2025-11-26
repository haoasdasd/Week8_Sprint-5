/* eslint-disable react/no-children-prop */
import { Fragment } from 'react/jsx-runtime'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Card, CardBody, CardTitle, Col, Form, Row } from 'reactstrap'
import ImageUpload from '~/app/components/image-upload-component'
import Input from '~/app/components/input-component'
import SelectSingle from '~/app/components/select/select-single-component'
import DatePicker from '~/app/components/date-picker-component'
import { useNavigate, useParams } from 'react-router-dom'
import { useEmployee } from '~/app/hooks/use-employee'
import { useStorePopup } from '~/app/shared/popup.shared'
import { UpdateEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { employeeUpdateSchema } from '~/app/schemas/employee.schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import { useEffect, useMemo, useRef } from 'react'
import { employeeCommandApi } from '~/app/apis/employee/command/employee.command.api'
import { queryClient } from '~/app/query-client'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { formatDateTimestamp, formatImageBase64 } from '~/app/utils/string.util'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import Textarea from '~/app/components/textarea-component'
import { useStoreHeader } from '~/app/shared/header.shared'
import { toast } from 'react-toastify'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Skeleton from '~/app/components/skeleton-component'
import useAuthStore from '~/app/shared/auth.shared'

export default function EmployeeUpdate() {
    const { getLangKey, isLoadingLang } = useLang()
    const { openModal, closeModal } = useStorePopup()
    const navigate = useNavigate()
    const { id } = useParams()
    const { profileEmployee, setProfileEmployee } = useAuthStore()

    const { setSubmit, closeSubmit, setIsLoading } = useStoreHeader()

    const { data: employee } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_ONE, id],
        queryFn: () => employeeQueryApi.getEmployeeById(Number(id)),
        enabled: !!id
    })
    const selectedBirthDate = useMemo(() => formatDateTimestamp(employee?.empBirthday ?? null), [employee])
    const selectedJointedDate = useMemo(() => formatDateTimestamp(employee?.empJoinedDate ?? null), [employee])

    const { messageSuccess } = useToastMessageAsync()

    const { mutate, error } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateEmployeeRequestType }) => employeeCommandApi.updateEmployee(id, body)
    })

    const {
        listProvincesAll,
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
        selectedCountry,
        setSelectedCountry,
        listCompanies
    } = useEmployee()

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
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<UpdateEmployeeRequestType>({
        resolver: yupResolver(employeeUpdateSchema),
        defaultValues: {
            empCitizenIdentity: '',
            empTaxCode: '',
            empCode: '',
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
            empRoleId: 1,
            countryId: '',
            empPlaceOfResidenceAddress: '',
            empPlaceOfResidenceWardId: 0,
            isActived: 1
        }
    })

    const onSubmit: SubmitHandler<UpdateEmployeeRequestType> = (data) => {
        setIsLoading(true)
        mutate(
            { id: Number(id), body: data },
            {
                onSuccess: async () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_PAGINATION_ALL] })
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_ONE, id] })
                    if (profileEmployee?.id === Number(id)) {
                        const response = await employeeQueryApi.getEmployeeById(Number(id))
                        setProfileEmployee(response)
                    }
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_UPDATE_SUCCESSFULLY))
                    navigate('/employee')
                },
                onError: () => {
                    setIsLoading(false)
                }
            }
        )
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

    useEffect(() => {
        if (employee) {
            reset(employee)
            if (employee.ward) {
                setValue('empPlaceOfResidenceWardId', employee.ward.localWardInfo.id, { shouldValidate: true })
                setValue('countryId', employee.ward.webLocalInfo.id, { shouldValidate: true })

                setSelectedCountry({
                    local: employee.ward.webLocalInfo.id,
                    province: employee.ward.localProvinceInfo.id,
                    district: employee.ward.localDistrictInfo.id,
                    ward: employee.ward.localWardInfo.id
                })
            }
        }
    }, [employee])

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    useEffect(() => {
        setSubmit(
            getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_UPDATE_EMPLOYEE),
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
                                                imageURL={employee?.empImage}
                                                onChange={handleImageBase64}
                                            />
                                        )}
                                    </Col>
                                    <Col lg={8}>
                                        <Row className='gx-4 gy-2 '>
                                            <Col lg={12}>
                                                {isLoadingLang ? (
                                                    <div className='d-flex flex-column  gap-1'>
                                                        <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                        <Skeleton className='mb-1' style={{ height: 40 }} />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_FIRSTNAME)}
                                                        placeholder={getLangKey(
                                                            CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_FIRSTNAME
                                                        )}
                                                        control={control}
                                                        name='empFirstName'
                                                        errors={errors}
                                                    />
                                                )}
                                            </Col>
                                            <Col lg={12}>
                                                {isLoadingLang ? (
                                                    <div className='d-flex flex-column  gap-1'>
                                                        <Skeleton style={{ width: '100px', marginBottom: 5 }} />
                                                        <Skeleton className='mb-1' style={{ height: 40 }} />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_LASTNAME)}
                                                        placeholder={getLangKey(
                                                            CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_LASTNAME
                                                        )}
                                                        control={control}
                                                        name='empLastName'
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
                                                label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE_INPUT_CODE)}
                                                placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_PLACEHOLDER_CODE)}
                                                control={control}
                                                name='empCode'
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
                                                value={selectedBirthDate}
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
                                                selected={!employee?.empGender ? String(0) : String(1)}
                                                errors={errors}
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
                                                selected={String(employee?.empPlaceOfBirth)}
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
                                            value={selectedJointedDate}
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
                                            selected={String(employee?.maritalId)}
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
                                            selected={String(employee?.nationId)}
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
                                            selected={String(employee?.religionId)}
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
                                                rows={4}
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
                                        <Row>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    horizontal
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_LOCAL)}
                                                    name='countryId'
                                                    errors={errors}
                                                    selected={employee?.ward?.webLocalInfo.id}
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
                                                    selected={String(employee?.ward?.localProvinceInfo.id)}
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
                                                    selected={String(employee?.ward?.localDistrictInfo.id)}
                                                    disabled={selectedCountry.province ? false : true}
                                                    customError={
                                                        typeof errors['empPlaceOfResidenceWardId']?.message === 'string' &&
                                                        !selectedCountry.district
                                                            ? errors['empPlaceOfResidenceWardId']?.message
                                                            : ''
                                                    }
                                                    initialOptions={listDistricts ?? []}
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
                                                    selected={String(employee?.ward?.localWardInfo.id)}
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
                                        <Row>
                                            <Col lg={12}>
                                                <SelectSingle
                                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_COMPANY)}
                                                    name='companyId'
                                                    selected={String(employee?.companyId)}
                                                    errors={errors}
                                                    initialOptions={listCompanies ?? []}
                                                    onChange={(e) => {
                                                        setValue('companyId', Number(e?.value), { shouldValidate: true })
                                                    }}
                                                />
                                            </Col>
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
                                                    selected={String(employee?.degreeId)}
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
                                                    selected={String(employee?.empRoleId)}
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
                                                    selected={String(employee?.traMajId)}
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
                                                    selected={String(employee?.bankId)}
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
