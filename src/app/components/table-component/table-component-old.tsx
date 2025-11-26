/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind'
import styles from './table-component.module.scss'
import Skeleton from '~/app/components/skeleton-component'
import Button from '~/app/components/button/button-component'
import { Input } from 'reactstrap'
import {
    ColumnDef,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    RowSelectionState,
    SortingState,
    useReactTable
} from '@tanstack/react-table'
import { Table as BootstrapTable } from 'reactstrap'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
    pointerWithin
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import DraggableRow from '~/app/components/table-component/_components/draggable-row'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import Dropdown from '~/app/components/dropdown-component'

type OptionDropdownActive = {
    key: string
    label?: string | React.ReactNode
    option?: { key: string; label: string | React.ReactNode }[]
    onChange?: (key: string) => void
}

type OptionDropdown = {
    key: string
    label: string | React.ReactNode
    option: { key: string; label: string | React.ReactNode }[]
    onChange?: (key: string) => void
    classDropdown?: string
    classDropdownMenu?: string
}

export interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onAdd?: () => void
    title?: string
    titleAdd?: string
    loading?: boolean
    // Props Expanding
    compactChild?: string
    subKeyChildren?: string
    // Props Search
    search?: boolean
    valueSearch?: string
    onChangeSearch?: (value: string) => void
    // Props Drag and Drop
    keyDnd?: string
    dataIdsDnd?: UniqueIdentifier[]
    onChangeDragEnd?: (event: DragEndEvent) => void
    // Dragging mode flag
    draggingMode?: boolean
    // Props Pagination
    pagination?: boolean
    pageNumber?: number
    pageSize?: number
    totalPages?: number
    onPaginationChange?: (pagination: { pageNumber?: number; pageSize?: number }) => void
    // OptionsFilter
    optionsFilter?: OptionDropdown[]
    // Grid border
    gridBorder?: boolean
    // OptionActive
    optionActive?: OptionDropdownActive
    // Default Rows Loading
    defaultRowsLoading?: number
    // Component Filter Custom
    componentFilter?: React.ReactNode
    externalRowSelection?: Record<string, boolean>
    onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>
    renderRow?: (row: any) => JSX.Element
}

const cx = classNames.bind(styles)
export default function Table<TData, TValue>({
    columns,
    data,
    onAdd,
    title,
    titleAdd,
    loading,
    compactChild,
    subKeyChildren,
    search = true,
    valueSearch,
    onChangeSearch,
    keyDnd,
    dataIdsDnd,
    onChangeDragEnd,
    draggingMode = false,
    pagination: showPagination = false,
    pageNumber = 0,
    pageSize = 10,
    totalPages = 0,
    optionsFilter,
    optionActive,
    onPaginationChange,
    defaultRowsLoading = 10,
    gridBorder = false,
    componentFilter,
    externalRowSelection,
    onRowSelectionChange
}: Readonly<TableProps<TData, TValue>>) {
    const { isLoadingLang } = useLang()
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(externalRowSelection || {})

    const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
        setRowSelection(updaterOrValue instanceof Function ? (prevState) => updaterOrValue(prevState) : updaterOrValue)
        onRowSelectionChange?.(updaterOrValue)
    }
    // Pagination Static
    const [pagination, setPagination] = useState({
        pageIndex: pageNumber ? pageNumber - 1 : 0,
        pageSize: pageSize ?? 10
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    // const [isInfinityScroll, setIsInfinityScroll] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(optionActive?.key ?? 'all')

    const table = useReactTable({
        data: data,
        columns,
        state: { rowSelection, globalFilter, sorting, expanded, ...(showPagination && { pagination }) },
        getCoreRowModel: getCoreRowModel(),
        // Select
        enableRowSelection: true,
        onRowSelectionChange: handleRowSelectionChange,
        getRowId: (row) => row.id,
        // Pagination
        ...(showPagination && {
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: setPagination
        }),
        // Search
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        // Sorting
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        // Sub Children
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        getSubRows: (row: any) => {
            if (typeof subKeyChildren === 'string') {
                return row[subKeyChildren]
            } else {
                return row
            }
        }
    })
    const { getLangKey } = useLang()

    // Better sensors config for handling nested components
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5 // Only start dragging after moving 5px
        }
    })

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250, // Wait this many ms before activating
            tolerance: 5 // Allow slight movement
        }
    })

    const keyboardSensor = useSensor(KeyboardSensor, {})

    // Improved sensors configuration
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

    const getPageNumbers = () => {
        const pages = []
        const visiblePages = 5 // Max number of visible pages
        console.log(totalPages)

        // Pagination Tanstack Table
        if (table.getPageCount() <= visiblePages) {
            // If there are less than or equal to 5 pages
            for (let i = 1; i <= table.getPageCount(); i++) {
                pages.push(i)
            }
        } else {
            // When there are more than 5 pages
            // Case 1: First page
            if (table.getState().pagination.pageIndex <= 3) {
                for (let i = 1; i <= visiblePages; i++) {
                    pages.push(i)
                }
            }
            // Case 2: 3 Last Page
            else if (table.getState().pagination.pageIndex > table.getPageCount() - 4) {
                console.log('case 2')
                for (let i = table.getPageCount() - visiblePages + 1; i <= table.getPageCount(); i++) {
                    pages.push(i)
                }
            }
            // Case 3: In the middle
            else {
                // Show the current page and 2 pages on the left and 2 pages on the right
                const leftOffset = 2
                const rightOffset = 2

                for (
                    let i = table.getState().pagination.pageIndex - leftOffset;
                    i <= table.getState().pagination.pageIndex + rightOffset;
                    i++
                ) {
                    if (i > 0 && i <= table.getPageCount()) {
                        pages.push(i)
                    }
                }
            }
        }

        // Pagination API
        // if (totalPages <= visiblePages) {
        //     // If there are less than or equal to 5 pages
        //     for (let i = 1; i <= totalPages; i++) {
        //         pages.push(i)
        //     }
        // } else {
        //     // When there are more than 5 pages

        //     // Case 1: First page
        //     if (pageNumber <= 3) {
        //         for (let i = 1; i <= visiblePages; i++) {
        //             pages.push(i)
        //         }
        //     }
        //     // Case 2: 3 Last Page
        //     else if (pageNumber > totalPages - 3) {
        //         for (let i = totalPages - visiblePages + 1; i <= totalPages; i++) {
        //             pages.push(i)
        //         }
        //     }
        //     // Case 3: In the middle
        //     else {
        //         // Show the current page and 2 pages on the left and 2 pages on the right
        //         const leftOffset = 2
        //         const rightOffset = 2

        //         for (let i = pageNumber - leftOffset; i <= pageNumber + rightOffset; i++) {
        //             if (i > 0 && i <= totalPages) {
        //                 pages.push(i)
        //             }
        //         }
        //     }
        // }

        return pages
    }

    // Infinity Scroll
    // const tableContainerRef = useRef<HTMLDivElement>(null)
    // const checkScrollPosition = () => {
    //     if (tableContainerRef.current && isInfinityScroll) {
    //         const divHeight = tableContainerRef.current.clientHeight

    //         const scrollHeight = tableContainerRef.current.scrollHeight

    //         const scrollTop = tableContainerRef.current.scrollTop

    //         // Check Scroll in at Bottom of Table
    //         if (scrollTop + divHeight >= scrollHeight - 10 && isInfinityScroll) {
    //             table.setPageSize(table.getState().pagination.pageSize + 5)
    //         }
    //     }
    // }
    // useEffect(() => {
    //     if (tableContainerRef.current && isInfinityScroll) {
    //         tableContainerRef.current.addEventListener('scroll', checkScrollPosition)
    //     }

    //     if (!isInfinityScroll) {
    //         table.setPageSize(10)
    //     }

    //     return () => {
    //         if (tableContainerRef.current && isInfinityScroll) {
    //             tableContainerRef.current.removeEventListener('scroll', checkScrollPosition)
    //         }
    //     }
    // }, [isInfinityScroll])

    // const initialOptionFilters = [
    //     {
    //         key: '1',
    //         label: (
    //             <div className={cx('dropdownItem')}>
    //                 <span className={cx('dorpdownItemScroll')}>
    //                     <i className='ri-scroll-to-bottom-line'></i>
    //                     {getLangKey(CONFIG_LANG_KEY.ERP365_TABLE_SCROLL)}:
    //                 </span>
    //                 <FormGroup switch style={{ marginBottom: '4px' }}>
    //                     <Input
    //                         type='switch'
    //                         role='switch'
    //                         checked={isInfinityScroll}
    //                         onChange={() => setIsInfinityScroll(!isInfinityScroll)}
    //                     />
    //                 </FormGroup>
    //             </div>
    //         )
    //     }
    // ]

    useEffect(() => {
        if (externalRowSelection !== undefined) {
            setRowSelection(externalRowSelection)
        }
    }, [externalRowSelection])

    const initialOptionActive = useMemo(
        () =>
            optionActive?.option ?? [
                {
                    label: <span className={cx('dropdownItem')}>{getLangKey(CONFIG_LANG_KEY.ERP365_ALL)}</span>,
                    key: 'all'
                },
                {
                    label: <span className={cx('dropdownItem')}>{getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED)}</span>,
                    key: 'inactive'
                },
                {
                    label: <span className={cx('dropdownItem')}>{getLangKey(CONFIG_LANG_KEY.ERP365_UNACTIVED)}</span>,
                    key: 'unactive'
                }
            ],
        [isLoadingLang]
    )

    return (
        <div className={cx('table', { gridBorder, draggingMode })}>
            {title && (
                <div className={cx('tableTitle')}>
                    {!isLoadingLang ? (
                        <h4 className={cx('title')}>{title}</h4>
                    ) : (
                        <Skeleton style={{ width: 200, padding: '12px' }} />
                    )}

                    {!isLoadingLang ? (
                        <div className={cx('titleRight')}>
                            {titleAdd && (
                                <Button className={cx('addBtn')} size='lg' color='success' onClick={onAdd}>
                                    + {titleAdd}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Skeleton style={{ width: 200, padding: '10px' }} />
                    )}
                </div>
            )}
            {componentFilter && <div className={cx('tableCustom')}>{componentFilter}</div>}
            <div className={cx('tableHeader')}>
                <div className={cx('tableHeaderLeft')}>
                    {search && (
                        <div className={cx('formIcon')}>
                            <Input
                                className={cx('searchInput')}
                                type='text'
                                placeholder={getLangKey(CONFIG_LANG_KEY.ERP365_SEARCH)}
                                value={valueSearch ?? globalFilter}
                                onChange={(e) => {
                                    if (onChangeSearch) {
                                        onChangeSearch(e.target.value)
                                    } else {
                                        setGlobalFilter(e.target.value)
                                    }
                                }}
                            />
                            <i className='ri-search-2-line'></i>
                        </div>
                    )}
                    {optionActive && (
                        <Dropdown
                            options={initialOptionActive}
                            onChange={(key) => {
                                optionActive.onChange?.(key)
                                setActiveDropdown(key)
                            }}
                            classDropdown={cx('dropdownActive')}
                            classDropdownMenu={cx('dropdownMenuActive')}
                        >
                            {optionActive.label ?? (
                                <span className={cx('dropdownItem')}>
                                    <i className='ri-arrow-down-s-line'></i>
                                    {activeDropdown === 'all'
                                        ? getLangKey(CONFIG_LANG_KEY.ERP365_ALL)
                                        : activeDropdown === 'inactive'
                                          ? getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED)
                                          : getLangKey(CONFIG_LANG_KEY.ERP365_UNACTIVED)}
                                </span>
                            )}
                        </Dropdown>
                    )}
                </div>
                <div className={cx('tableHeaderRight')}>
                    {optionsFilter?.map((item) => (
                        <Dropdown
                            options={item.option}
                            key={item.key}
                            onChange={item.onChange}
                            classDropdown={cx('dropdownFilter', item.classDropdown)}
                            classDropdownMenu={cx('dropdownMenuFilter', item.classDropdownMenu)}
                        >
                            {item.label}
                        </Dropdown>
                    ))}
                </div>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragEnd={onChangeDragEnd}
                modifiers={[restrictToVerticalAxis]}
                // Add autoScroll only for MenuCatalog
                {...(draggingMode
                    ? {
                          autoScroll: {
                              threshold: { x: 0.2, y: 0.2 },
                              acceleration: 10,
                              interval: 5
                          }
                      }
                    : {})}
            >
                <div
                    className={cx('tableBox')}
                    // ref={tableContainerRef}
                    // style={{
                    //     overflow: isInfinityScroll ? 'auto' : '',
                    //     position: isInfinityScroll ? 'relative' : 'static',
                    //     height: isInfinityScroll ? '400px' : ''
                    // }}
                >
                    <BootstrapTable hover className='align-middle table-nowrap' style={{ tableLayout: 'fixed' }}>
                        <thead
                            className='table-light text-muted text-uppercase text-nowrap'
                            // style={{ position: isInfinityScroll ? 'sticky' : 'static', top: 0, zIndex: 2 }}
                        >
                            {table.getHeaderGroups().map((headerGroup) =>
                                isLoadingLang ? (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header, index) => (
                                            <th key={index} className={cx('trow')} style={{ width: header.column.getSize() }}>
                                                <Skeleton className={cx('tableSkeleton')} />
                                            </th>
                                        ))}
                                    </tr>
                                ) : (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className={cx('tableHead')}
                                                style={{
                                                    width: header.column.getSize()
                                                }}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        title={
                                                            header.column.getCanSort()
                                                                ? header.column.getNextSortingOrder() === 'asc'
                                                                    ? 'Sort ascending'
                                                                    : header.column.getNextSortingOrder() === 'desc'
                                                                      ? 'Sort descending'
                                                                      : 'Clear sort'
                                                                : undefined
                                                        }
                                                        className={cx('tableHeadItem')}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}{' '}
                                                        {header.column.getCanSort() && (
                                                            <i
                                                                className='ri-expand-up-down-line'
                                                                style={{ color: 'rgba(30, 124, 187,0.7)', marginBottom: '1px' }}
                                                            ></i>
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                )
                            )}
                        </thead>
                        <tbody>
                            {loading || isLoadingLang ? (
                                Array.from({ length: defaultRowsLoading }).map((_, colIndex) => (
                                    <tr key={colIndex}>
                                        {Array.from({ length: table.getHeaderGroups()[0].headers.length }).map((_, index) => (
                                            <td key={index} className={cx('tcol')}>
                                                <Skeleton className={cx('tableSkeleton')} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : table.getRowModel().rows.length == 0 ? (
                                <span></span>
                            ) : (
                                <SortableContext items={dataIdsDnd ?? []} strategy={verticalListSortingStrategy}>
                                    {table.getRowModel().rows.map((row, index) => (
                                        <DraggableRow
                                            key={index}
                                            row={row}
                                            dndKey={keyDnd ?? ''}
                                            draggingMode={draggingMode}
                                            compactChild={compactChild}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </tbody>
                    </BootstrapTable>
                </div>
                {table.getRowModel().rows.length === 0 && (
                    <div className={cx('tableNoData')}>
                        <h4 className={cx('tableNoDataTitle')}>
                            {getLangKey(CONFIG_LANG_KEY.ERP365_DATA_NOT_AVAILABLE)} <i className='ri-file-warning-line'></i>
                        </h4>
                    </div>
                )}
                {table.getRowModel().rows.length > 0 && showPagination && (
                    <div className={cx('tablePagination')}>
                        {table.getState().pagination.pageSize <= 20 && (
                            <Fragment>
                                <span>{getLangKey(CONFIG_LANG_KEY.ERP365_ROW_PER_PAGE)}:</span>
                                <Dropdown
                                    options={[
                                        { key: '10', label: '10' },
                                        { key: '15', label: '15' },
                                        { key: '20', label: '20' }
                                    ]}
                                    onChange={(key) => {
                                        // onPaginationChange?.({ pageNumber, pageSize: Number(key) })
                                        console.log(onPaginationChange)
                                        table.setPageSize(Number(key))
                                    }}
                                    classDropdown={cx('tableDropdownRow')}
                                >
                                    <div className={cx('tableDropdownRowBox')}>
                                        {/* <span className=''>{pageSize}</span> */}
                                        <span className=''>{table.getState().pagination.pageSize}</span>

                                        <i className='ri-arrow-down-s-line'></i>
                                    </div>
                                </Dropdown>
                            </Fragment>
                        )}
                        {/* Pagination Tanstack Table */}
                        <div className={cx('tableBoxPagination')}>
                            <button
                                onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                                className={cx('tableBoxPaginationItem', { disabled: !table.getCanPreviousPage() })}
                                disabled={table.getState().pagination.pageIndex === 0}
                            >
                                <i className='ri-arrow-left-double-line'></i>
                            </button>
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => table.setPageIndex(page - 1)}
                                    className={cx('tableBoxPaginationItem', {
                                        active: page === table.getState().pagination.pageIndex + 1
                                    })}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                                className={cx('tableBoxPaginationItem', { disabled: !table.getCanNextPage() })}
                                disabled={table.getState().pagination.pageIndex === table.getPageCount()}
                            >
                                <i className='ri-arrow-right-double-line'></i>
                            </button>
                        </div>
                        {/* Pagination API */}
                        {/* <div className={cx('tableBoxPagination')}>
                            <button
                                onClick={() => onPaginationChange?.({ pageNumber: pageNumber - 1, pageSize })}
                                className={cx('tableBoxPaginationItem', { disabled: pageNumber === 1 })}
                                disabled={pageNumber === 1}
                            >
                                <i className='ri-arrow-left-double-line'></i>
                            </button>
                            {getPageNumbers().map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => onPaginationChange?.({ pageNumber: index + 1, pageSize })}
                                    className={cx('tableBoxPaginationItem', { active: index + 1 === pageNumber })}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => onPaginationChange?.({ pageNumber: pageNumber + 1, pageSize })}
                                className={cx('tableBoxPaginationItem', { disabled: pageNumber === totalPages })}
                                disabled={pageNumber === totalPages}
                            >
                                <i className='ri-arrow-right-double-line'></i>
                            </button>
                        </div> */}
                    </div>
                )}
            </DndContext>
        </div>
    )
}