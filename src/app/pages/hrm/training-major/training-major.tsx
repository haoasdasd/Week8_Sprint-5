import { Fragment } from 'react/jsx-runtime'
import styles from './training-major.module.scss'
import classNames from 'classnames/bind'
import Table from '~/app/components/table-component'
import { TrainingMajorType } from '~/app/types/training-major/response/training-major.type'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { trainingMajorQueryApi } from '~/app/apis/training-major/query/training-major.query.api'
import { useMemo, useState } from 'react'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import ModalDelete from '~/app/components/modal-delete-component'
import { ColumnDef } from '@tanstack/react-table'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import ModalCreateTrainingMajor from '~/app/pages/hrm/training-major/_components/modal-create-training-major'
import ModalUpdateTrainingMajor from '~/app/pages/hrm/training-major/_components/modal-update-training-major'

const cx = classNames.bind(styles)
export default function TrainingMajor() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [trainingMajorId, setTrainingMajorId] = useState(0)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<TrainingMajorType[]>({
        queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ALL],
        queryFn: () => trainingMajorQueryApi.getAllTrainingMajor(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    // const { mutate, error: deleteLocalError } = useMutation({
    //     mutationFn: (id: number) => trainingMajorCommandApi.deleteTrainingMajor(id)
    // })

    // const handleDelete = (id: number) => {
    //     mutate(id, {
    //         onSuccess: () => {
    //             queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ALL] })
    //             queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ONE, id] })
    //             setIsModalDelete(false)
    //             messageSuccess(t('Delete successfully'))
    //         }
    //     })
    // }

    const columns: ColumnDef<TrainingMajorType>[] = useMemo(
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
                accessorKey: 'trainingMajorName',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_TABLE_HEADER_TM)
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
            setTrainingMajorId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            setTrainingMajorId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_ADD_TM)}
                    defaultRowsLoading={1}
                />
            </div>
            <ModalCreateTrainingMajor modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateTrainingMajor id={trainingMajorId} modal={isModalUpdate} toggle={toggleModalUpdate} />
            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_TRAINING_MAJOR)}
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
