import { Fragment } from 'react/jsx-runtime'
import styles from './bank.module.scss'
import classNames from 'classnames/bind'
import Table from '~/app/components/table-component'
import { useQuery } from '@tanstack/react-query'
import { BankType } from '~/app/types/bank/response/bank.type'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { bankQueryApi } from '~/app/apis/bank/query/bank.query.api'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateBank from '~/app/pages/hrm/bank/_components/modal-create-bank'
import ModalUpdateBank from '~/app/pages/hrm/bank/_components/modal-update-bank'

const cx = classNames.bind(styles)
export default function Bank() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [bankId, setBankId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<BankType[]>({
        queryKey: [TANSTACK_KEY.BANK_ALL],
        queryFn: () => bankQueryApi.getAllBank(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => bankCommandApi.deleteBank(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.BANK_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.BANK_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<BankType>[] = useMemo(
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
                accessorKey: 'bankName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_BANK_TABLE_HEADER_BANK)
            },
            {
                header: getLangKey(CONFIG_LANG_KEY.ERP365_ACTION),
                accessorKey: '',
                enableSorting: false,
                cell: ({ row }) => {
                    const { id } = row.original
                    return (
                        <div className={cx('actions')}>
                            <span className='ri-pencil-fill iconBlue' onClick={() => toggleModalUpdate(id)}></span>
                            <span className='ri-delete-bin-6-fill iconDanger' onClick={() => toggleModalDelete(id)}></span>
                        </div>
                    )
                }
            }
        ],
        [isLoadingLang, language]
    )

    const toggleModal = () => {
        setIsModalCreate(!isModalCreate)
    }

    const toggleModalUpdate = (id?: number) => {
        if (id) {
            setBankId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setBankId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_ADD_BANK)}
                    defaultRowsLoading={1}
                />
            </div>
            <ModalCreateBank modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateBank id={bankId} modal={isModalUpdate} toggle={toggleModalUpdate} />

            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_BANK)}
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
