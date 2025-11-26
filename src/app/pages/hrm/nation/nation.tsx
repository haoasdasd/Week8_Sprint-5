import classNames from 'classnames/bind'
import styles from './nation.module.scss'
import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import { useQuery } from '@tanstack/react-query'
import { NationType } from '~/app/types/nation/response/nation.type'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { nationQueryApi } from '~/app/apis/nation/query/nation.query.api'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateNation from '~/app/pages/hrm/nation/_components/modal-create-nation'
import ModalUpdateNation from '~/app/pages/hrm/nation/_components/modal-update-nation'

const cx = classNames.bind(styles)
export default function Nation() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [nationId, setNationId] = useState(0)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<NationType[]>({
        queryKey: [TANSTACK_KEY.NATION_ALL],
        queryFn: () => nationQueryApi.getAllNation(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => nationCommandApi.deleteNation(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.NATION_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.NATION_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<NationType>[] = useMemo(
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
                accessorKey: 'nationName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_NATION_TABLE_HEADER_NATION)
            },
            {
                header: getLangKey(CONFIG_LANG_KEY.ERP365_ACTION),
                accessorKey: '',
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
            setNationId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setNationId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_ADD_NATION)}
                    defaultRowsLoading={1}
                />
            </div>
            <ModalCreateNation modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateNation id={nationId} modal={isModalUpdate} toggle={toggleModalUpdate} />

            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_NATION)}
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
