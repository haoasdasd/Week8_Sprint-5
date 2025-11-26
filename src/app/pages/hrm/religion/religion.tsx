import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import styles from './religion.module.scss'
import classNames from 'classnames/bind'
import { ReligionType } from '~/app/types/religion/response/religion.type'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { religionQueryApi } from '~/app/apis/religion/query/religion.query.api'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateReligion from '~/app/pages/hrm/religion/_components/modal-create-religion'
import ModalUpdateReligion from '~/app/pages/hrm/religion/_components/modal-update-religion'

const cx = classNames.bind(styles)
export default function Religion() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [religionId, setReligionId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<ReligionType[]>({
        queryKey: [TANSTACK_KEY.RELIGION_ALL],
        queryFn: () => religionQueryApi.getAllReligion(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })
    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => religionCommandApi.deleteReligion(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.RELIGION_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.RELIGION_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<ReligionType>[] = useMemo(
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
                accessorKey: 'religionName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_TABLE_HEADER_RELIGION)
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
            setReligionId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setReligionId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_ADD_RELIGION)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalCreateReligion modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateReligion id={religionId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_RELIGION)}
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
