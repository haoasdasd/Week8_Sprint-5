import { Fragment } from 'react/jsx-runtime'
import styles from './employee.module.scss'
import classNames from 'classnames/bind'
import Table from '~/app/components/table-component'
import { useMutation, useQuery } from '@tanstack/react-query'
import { EmployeeType } from '~/app/types/employee/response/employee.type'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '~/app/configs/routes.config'
import ModalDelete from '~/app/components/modal-delete-component'
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { formatDateTimestamp } from '~/app/utils/string.util'
import Badge from '~/app/components/badge-component'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Image from '~/app/components/image-component'

import useDebounce from '~/app/hooks/useDebounce'
import { GetAllEmployeeRequestType } from '~/app/types/employee/request/employee.type'
import { ApiQueryPaginationResponseType } from '~/app/types/utils/api.type'
import ModalViewEmployee from '~/app/pages/hrm/emp/employee/_components/modal-view-employee'
import { useStorePopup } from '~/app/shared/popup.shared'
import { employeeCommandApi } from '~/app/apis/employee/command/employee.command.api'
import useAuthStore from '~/app/shared/auth.shared'

const cx = classNames.bind(styles)
export default function Employee() {
    const { getLangKey, isLoadingLang, language } = useLang()
    const navigate = useNavigate()
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [employeeId, setEmployeeId] = useState(0)
    const { messageSuccess } = useToastMessageAsync()
    const [isModalView, setIsModalView] = useState(false)
    const { profileEmployee } = useAuthStore()
    const { openModal, closeModal } = useStorePopup()

    const mutationResetPassword = useMutation({
        mutationFn: (id: number) => employeeCommandApi.resetPassword(id),
        onSuccess: () => {
            messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_RESET_PASS_SUCCESSFULLY))
        },
        onSettled: () => {
            closeModal()
        }
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => employeeCommandApi.deleteEmployee(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.EMPLOYEE_ONE, id] })
    //             setIsModalDelete(false)
    //             messageSuccess(t('Delete successfully'))
    //         }
    //     })
    // }

    const [keyword, setKeyword] = useState('')
    const debounced = useDebounce(keyword, 1000)
    const [paramsEmployee, setParamsEmployee] = useState<GetAllEmployeeRequestType>({
        isActived: 1,
        pageNumber: 1,
        pageSize: 500,
        empName: debounced,
        isDescending: false,
        // default company test
        companyId: 9 // Initialize with null instead of 0 to indicate "not ready"
    })

    // Update paramsEmployee when profileEmployee.companyId or debounced changes
    useEffect(() => {
        if (profileEmployee?.companyId) {
            setParamsEmployee((prev) => ({
                ...prev,
                companyId: profileEmployee.companyId,
                empName: debounced
            }))
        }
    }, [profileEmployee?.companyId, debounced])

    console.log('profileEmployee?.companyId', profileEmployee?.companyId)

    const { data } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_PAGINATION_ALL, profileEmployee?.companyId],
        queryFn: () => employeeQueryApi.getAllEmployee(paramsEmployee),

        enabled: !!profileEmployee?.companyId && paramsEmployee.companyId !== null // Only run when companyId is valid
    })
    const employeeData = data as ApiQueryPaginationResponseType<EmployeeType[]>

    const columns: ColumnDef<EmployeeType>[] = useMemo(
        () => [
            {
                id: 'select',
                size: 40,
                header: ({ table }) => {
                    return (
                        <input
                            type='checkbox'
                            checked={table.getIsAllRowsSelected()}
                            ref={(input) => {
                                if (input) input.indeterminate = table.getIsSomeRowsSelected()
                            }}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                        />
                    )
                },
                cell: ({ row }) => {
                    return <input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
                }
            },
            {
                accessorKey: 'stt',
                size: 50,
                header: getLangKey(CONFIG_LANG_KEY.ERP365_NO_NUMBER),
                cell: ({ row }) => {
                    const index = row.index
                    return <span className={cx('columnIdDetail', 'rowId')}>{index + 1}</span>
                }
            },
            {
                accessorKey: 'id',
                header: 'Id',
                cell: ({ row }) => {
                    const { id } = row.original
                    return <span className={cx('columnIdDetail', 'rowId')}>{id}</span>
                }
            },
            {
                accessorKey: 'empFirstName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_FULLNAME),
                cell: ({ row }) => {
                    const { empFirstName, empLastName, empImage, empCode } = row.original
                    return (
                        <div className={cx('imageBox')}>
                            <Image className={cx('image')} src={empImage} alt={empLastName} />
                            <div className={cx('info')}>
                                <span>
                                    {empFirstName} {empLastName}
                                </span>
                                <span className={cx('infoEmpCode')}>{empCode}</span>
                            </div>
                        </div>
                    )
                }
            },

            {
                accessorKey: 'empBirthday',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_DATE_OF_BIRTH),
                cell: ({ row }) => {
                    const { empBirthday } = row.original
                    return empBirthday ? (
                        <span>{formatDateTimestamp(empBirthday).toLocaleDateString('vi-VN')}</span>
                    ) : (
                        getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                    )
                }
            },
            {
                accessorKey: 'empGender',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_GENDER),
                enableSorting: false,
                cell: ({ row }) => {
                    const { empGender } = row.original
                    return (
                        <span>
                            {!empGender ? getLangKey(CONFIG_LANG_KEY.ERP365_MALE) : getLangKey(CONFIG_LANG_KEY.ERP365_FEMALE)}
                        </span>
                    )
                }
            },
            {
                accessorKey: 'empRoleName',
                header: getLangKey(CONFIG_LANG_KEY.ERP365_POSITION)
            },
            {
                accessorKey: 'empTel',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_TEL)
            },
            {
                header: getLangKey(CONFIG_LANG_KEY.ERP365_ACTIVED),
                accessorKey: 'isActived',
                enableSorting: false,
                cell: ({ row }) => {
                    const { isActived } = row.original
                    return isActived ? (
                        <Badge soft={true} color='success'>
                            {getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED)}
                        </Badge>
                    ) : (
                        <Badge soft={true} color='warning'>
                            {getLangKey(CONFIG_LANG_KEY.ERP365_UNACTIVED)}
                        </Badge>
                    )
                }
            },
            {
                header: getLangKey(CONFIG_LANG_KEY.ERP365_ACTION),
                accessorKey: '',
                enableSorting: false,
                cell: ({ row }) => {
                    const { id, isActived } = row.original
                    return (
                        <div className={cx('actions')}>
                            <i className='ri-lock-password-fill iconBlue' onClick={() => toggleResetPassword(id)}></i>
                            <span className='ri-eye-fill iconBlue' onClick={() => toggleModalView(id)}></span>
                            <span className='ri-pencil-fill iconBlue' onClick={() => navigate(`/employee/update/${id}`)}></span>
                            <span
                                className={`ri-delete-bin-6-fill ${isActived ? 'iconDanger' : 'iconSecondary'}`}
                                onClick={() => isActived && toggleModalDelete(id)}
                            ></span>
                        </div>
                    )
                }
            }
        ],
        [isLoadingLang, language]
    )

    const toggleResetPassword = useCallback((id: number) => {
        const title = `Reset mật khẩu`
        const message = `Bạn có chắc chắn yêu cầu đặt lại mật khẩu cho nhân viên này?`
        openModal(title, message, () => {
            mutationResetPassword.mutate(id)
        })
    }, [])

    const toggleModalView = useCallback(
        (id?: number) => {
            if (id) {
                setEmployeeId(id)
            }
            setIsModalView(!isModalView)
        },
        [isModalView]
    )

    const toggleModalDelete = useCallback((id?: number) => {
        if (id) {
            console.log(employeeId)
            setEmployeeId(id)
        }
        setIsModalDelete(!isModalDelete)
    }, [])

    const handleChangeSort = useCallback((key: string) => {
        if (key === 'asc') {
            setParamsEmployee((prevState) => ({ ...prevState, isDescending: false }))
        } else {
            setParamsEmployee((prevState) => ({ ...prevState, isDescending: true }))
        }
    }, [])

    const initialOptionFilterSort = useMemo(
        () => [
            {
                key: 'asc',
                label: (
                    <span className={cx('dropdownItem')}>
                        <i className='ri-sort-alphabet-asc'></i>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_SORT_BY)}: name (A-Z)
                    </span>
                )
            },
            {
                key: 'desc',
                label: (
                    <span className={cx('dropdownItem')}>
                        <i className='ri-sort-alphabet-desc'></i>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_SORT_BY)}: name (Z-A)
                    </span>
                )
            }
        ],
        [isLoadingLang]
    )

    const handleChangeActive = useCallback((key: string) => {
        if (key === 'all') {
            setParamsEmployee((prevState) => ({ ...prevState, isActived: null }))
        } else if (key === 'inactive') {
            setParamsEmployee((prevState) => ({ ...prevState, isActived: 1 }))
        } else {
            setParamsEmployee((prevState) => ({ ...prevState, isActived: 0 }))
        }
    }, [])

    return (
        <Fragment>
            <div className='container-content'>
                <Table
                    loading={isLoadingLang}
                    columns={columns}
                    data={employeeData?.items || []}
                    pageNumber={employeeData?.pageNumber}
                    pageSize={employeeData?.pageSize}
                    totalPages={employeeData?.totalPages}
                    valueSearch={keyword}
                    onChangeSearch={(value: SetStateAction<string>) => setKeyword(value)}
                    onPaginationChange={(pagination: GetAllEmployeeRequestType) => {
                        setParamsEmployee((prevState) => ({ ...prevState, ...pagination }))
                    }}
                    optionActive={{
                        key: 'all',
                        onChange: handleChangeActive
                    }}
                    optionsFilter={[
                        {
                            key: '1',
                            label:
                                paramsEmployee.isDescending === undefined ? (
                                    <span className={cx('dropdownItem')}>
                                        <i className='ri-sort-alphabet-asc'></i>
                                        {getLangKey(CONFIG_LANG_KEY.ERP365_SORT_BY)}: name (A-Z)
                                    </span>
                                ) : (
                                    initialOptionFilterSort.find(
                                        (item) => item.key === (!paramsEmployee.isDescending ? 'asc' : 'desc')
                                    )?.label
                                ),
                            option: initialOptionFilterSort,
                            onChange: handleChangeSort
                        }
                    ]}
                    onAdd={() => navigate(APP_ROUTES.EMPLOYEE_ADD)}
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_ADD_EMPLOYEE)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalViewEmployee id={employeeId} modal={isModalView} toggle={toggleModalView} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE)}
                show={isModalDelete}
                onCloseClick={toggleModalDelete}
                onDeleteClick={() => {
                    setIsModalDelete(false)
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_DELETE_SUCCESSFULLY))
                }}
                // error={t(deleteLocalError?.message ?? '')}
            />
        </Fragment>
    )
}
