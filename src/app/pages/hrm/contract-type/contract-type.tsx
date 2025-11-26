import classNames from 'classnames/bind'
import styles from './contract-type.module.scss'
import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import { ContractTypeType } from '~/app/types/contract-type/response/contract-type.type'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { contractTypeQueryApi } from '~/app/apis/contract-type/query/contract-type.query.api'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateContractType from '~/app/pages/hrm/contract-type/_components/modal-create-contract-type'
import ModalUpdateContractType from '~/app/pages/hrm/contract-type/_components/modal-update-contract-type'

const cx = classNames.bind(styles)
export default function ContractType() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [contractTypeId, setContractTypeId] = useState(0)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<ContractTypeType[]>({
        queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ALL],
        queryFn: () => contractTypeQueryApi.getAllContractType(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => contractTypeCommandApi.deleteContractType(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<ContractTypeType>[] = useMemo(
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
                accessorKey: 'contractTypeCode',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TABLE_HEADER_CT_CODE)
            },
            {
                accessorKey: 'contractTypeName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TABLE_HEADER_CT)
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
            setContractTypeId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setContractTypeId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_ADD_CT)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalCreateContractType modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateContractType id={contractTypeId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_CONTRACT_TYPE)}
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
