import classNames from 'classnames/bind'
import styles from './employee-verify.module.scss'
import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import { ColumnDef } from '@tanstack/react-table'
import { EmployeeVerifyType } from '~/app/types/employee-verify/response/employee-verify.type'
import { formatDateTimestamp } from '~/app/utils/string.util'
import Badge from '~/app/components/badge-component'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { employeeVerifyQueryApi } from '~/app/apis/employee-verify/query/employee-verify.query.api'
import { useMemo, useState } from 'react'
import ModalDelete from '~/app/components/modal-delete-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Image from '~/app/components/image-component'
import ModalCreateEmployeeVerify from '~/app/pages/hrm/emp/employee-verify/_components/modal-create-employee-verify'
import ModalUpdateEmployeeVerify from '~/app/pages/hrm/emp/employee-verify/_components/modal-update-employee-verify'

const cx = classNames.bind(styles)
export default function EmployeeVerify() {
    const { getLangKey, isLoadingLang, language } = useLang()
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [empVerId, setEmpVerId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<EmployeeVerifyType[]>({
        queryKey: [TANSTACK_KEY.EMOLOYEE_VERIFY_ALL],
        queryFn: () => employeeVerifyQueryApi.getAllEmployeeVerify(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    const columns: ColumnDef<EmployeeVerifyType>[] = useMemo(
        () => [
            {
                id: 'select',
                size: 10,
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
                accessorKey: 'id',
                size: 20,
                header: getLangKey(CONFIG_LANG_KEY.ERP365_NO_NUMBER),
                cell: ({ row }) => {
                    const index = row.index
                    return <span className={cx('columnIdDetail', 'rowId')}>{index + 1}</span>
                }
            },
            {
                accessorKey: 'userIdVerify',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_TABLE_HEADER_CODE),
                cell: ({ row }) => {
                    const { verImage, userIdVerify } = row.original
                    return (
                        <div className={cx('imageBox')}>
                            <Image className={cx('image')} src={verImage} alt={'avatar'} />
                            <span>{userIdVerify}</span>
                        </div>
                    )
                }
            },
            {
                accessorKey: 'verCreatedDate',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_TABLE_HEADER_DATE_VERIFY),
                cell: ({ row }) => {
                    const { verCreatedDate } = row.original
                    return verCreatedDate ? (
                        <span>{formatDateTimestamp(verCreatedDate).toLocaleDateString('vi-VN')}</span>
                    ) : (
                        getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                    )
                }
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
                            <span className='ri-pencil-fill iconBlue' onClick={() => toggleModalUpdate(id)}></span>
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

    const toggleModalUpdate = (id?: number) => {
        if (id) {
            setEmpVerId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModal = () => setIsModalCreate(!isModalCreate)

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setEmpVerId(id)
        }
        setIsModalDelete(!isModalDelete)
    }

    return (
        <Fragment>
            <div className='container-content'>
                <Table
                    loading={isLoadingLang}
                    columns={columns}
                    data={data || []}
                    onAdd={toggleModal}
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_VERIFY_ADD_EV)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalCreateEmployeeVerify modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateEmployeeVerify id={empVerId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_EMPLOYEE_VERIFY)}
                show={isModalDelete}
                onCloseClick={toggleModalDelete}
                onDeleteClick={() => {
                    setIsModalDelete(false)
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_DELETE_SUCCESSFULLY))
                }}
            />
        </Fragment>
    )
}
