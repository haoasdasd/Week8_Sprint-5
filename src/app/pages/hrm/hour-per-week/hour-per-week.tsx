import classNames from 'classnames/bind'
import styles from './hour-per-week.module.scss'
import { Fragment, useMemo, useState } from 'react'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { HourPerWeekType } from '~/app/types/hour-per-week/response/hour-per-week.type'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { hourPerWeekQueryApi } from '~/app/apis/hour-per-week/query/hour-per-week.query.api'
import lodash from 'lodash'
import { ColumnDef } from '@tanstack/react-table'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Table from '~/app/components/table-component'
import ModalDelete from '~/app/components/modal-delete-component'
import ModalCreateHourPerWeek from '~/app/pages/hrm/hour-per-week/_components/modal-create-hour-per-week'
import ModalUpdateHourPerWeek from '~/app/pages/hrm/hour-per-week/_components/modal-update-hour-per-week'

const cx = classNames.bind(styles)
export default function HourPerWeek() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [hourPerWeekId, sethourPerWeekId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<HourPerWeekType[]>({
        queryKey: [TANSTACK_KEY.HOUR_PER_WEEK_ALL],
        queryFn: () => hourPerWeekQueryApi.getAllHourPerWeek(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    const columns: ColumnDef<HourPerWeekType>[] = useMemo(
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
                accessorKey: 'day',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_TABLE_HEADER_HPW)
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
            sethourPerWeekId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            sethourPerWeekId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_ADD_HPW)}
                    defaultRowsLoading={2}
                />
            </div>
            <ModalCreateHourPerWeek modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateHourPerWeek id={hourPerWeekId} modal={isModalUpdate} toggle={toggleModalUpdate} />

            <ModalDelete
                recordId={getLangKey(CONFIG_LANG_KEY.ERP365_HOUR_PER_WEEK)}
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
