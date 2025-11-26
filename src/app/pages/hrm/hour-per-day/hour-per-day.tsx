import classNames from 'classnames/bind'
import styles from './hour-per-day.module.scss'
import { Fragment, useMemo, useState } from 'react'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { HourPerDayType } from '~/app/types/hour-per-day/response/hour-per-day.type'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useQuery } from '@tanstack/react-query'
import { hourPerDayQueryApi } from '~/app/apis/hour-per-day/query/hour-per-day.query.api'
import lodash from 'lodash'
import { ColumnDef } from '@tanstack/react-table'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Table from '~/app/components/table-component'
import ModalDelete from '~/app/components/modal-delete-component'
import ModalCreateHourPerDay from '~/app/pages/hrm/hour-per-day/_components/modal-create-hour-per-day'
import ModalUpdateHourPerDay from '~/app/pages/hrm/hour-per-day/_components/modal-update-hour-per-day'

const cx = classNames.bind(styles)
export default function HourPerDay() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [hourPerDayId, sethourPerDayId] = useState(0)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const { getLangKey, isLoadingLang, language } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data } = useQuery<HourPerDayType[]>({
        queryKey: [TANSTACK_KEY.HOUR_PER_DAY_ALL],
        queryFn: () => hourPerDayQueryApi.getAllHourPerDay(),

        select: (data) => lodash.sortBy(data, 'id').reverse()
    })

    const columns: ColumnDef<HourPerDayType>[] = useMemo(
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
                header: getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TABLE_HEADER_HPD)
            },
            {
                accessorKey: 'timeFrom',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TABLE_HEADER_FROM)
            },
            {
                accessorKey: 'timeTo',
                header: getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TABLE_HEADER_TO)
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
            sethourPerDayId(id)
        }
        setIsModalUpdate(!isModalUpdate)
    }

    const toggleModalDelete = (id?: number) => {
        if (id) {
            sethourPerDayId(id)
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
                    title={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TITLE)}
                    titleAdd={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_ADD_HPD)}
                    defaultRowsLoading={3}
                />
            </div>
            <ModalCreateHourPerDay modal={isModalCreate} toggle={toggleModal} />
            <ModalUpdateHourPerDay id={hourPerDayId} modal={isModalUpdate} toggle={toggleModalUpdate} />

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
