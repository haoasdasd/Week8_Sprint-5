import classNames from 'classnames/bind'
import styles from './degree.module.scss'
import { DegreeType } from '~/app/types/degree/response/degree.type'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { degreeQueryApi } from '~/app/apis/degree/query/degree.query.api'
import { Fragment } from 'react/jsx-runtime'
import Table from '~/app/components/table-component'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateDegree from '~/app/pages/hrm/degree/_components/modal-create-degree'
import ModalUpdateDegree from '~/app/pages/hrm/degree/_components/modal-update-degree'

const cx = classNames.bind(styles)
function Degree() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [degreeId, setDegreeId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<DegreeType[]>({
        queryKey: [TANSTACK_KEY.DEGREE_ALL],
        queryFn: () => degreeQueryApi.getAllDegree(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => degreeCommandApi.deleteDegree(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.DEGREE_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.DEGREE_ONE, id] })
    //             messageSuccess(t('Delete successfully'))
    //             setIsModalDelete(false)
    //         }
    //     })
    // }

    const columns: ColumnDef<DegreeType>[] = useMemo(
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
                accessorKey: 'degreeName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_TABLE_HEADER_DEGREE)
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
            setDegreeId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setDegreeId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_ADD_DEGREE)}
                    defaultRowsLoading={3}
                />
            </div>
            <ModalCreateDegree modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateDegree id={degreeId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_DEGREE)}
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

export default Degree
