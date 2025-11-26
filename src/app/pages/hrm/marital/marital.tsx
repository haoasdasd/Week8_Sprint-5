import classNames from 'classnames/bind'
import styles from './marital.module.scss'
import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import { MaritalType } from '~/app/types/marital/response/marital.type'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useQuery } from '@tanstack/react-query'
import { maritalQueryApi } from '~/app/apis/marital/query/marital.query.api'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateMarital from '~/app/pages/hrm/marital/_components/modal-create-marital'
import ModalUpdateMarital from '~/app/pages/hrm/marital/_components/modal-update-marital'

const cx = classNames.bind(styles)
export default function Marital() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [maritalId, setMaritalId] = useState(0)
    const { getLangKey, isLoadingLang, language } = useLang()

    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<MaritalType[]>({
        queryKey: [TANSTACK_KEY.MARITAL_ALL],
        queryFn: () => maritalQueryApi.getAllMarital(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => maritalCommandApi.deleteMarital(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.MARITAL_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.MARITAL_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<MaritalType>[] = useMemo(
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
                accessorKey: 'maritalName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_TABLE_HEADER_MARITAL)
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
            setMaritalId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setMaritalId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_ADD_MARITAL)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalCreateMarital modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateMarital id={maritalId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_MARITAL)}
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
