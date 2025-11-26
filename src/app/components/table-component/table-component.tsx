import * as React from "react"
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
  useReactTable,
} from "@tanstack/react-table"
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { cn } from "~/lib/utils"
import { Button } from "~/app/components/ui/button"
import { Input } from "~/app/components/ui/input"
import {
    Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card"
import { Badge } from "~/app/components/ui/badge"
import { Skeleton } from "~/app/components/ui/skeleton"
import { Search, ChevronDown, ChevronUp, MoreHorizontal, ArrowUpDown } from "lucide-react"

// Import your existing hooks and types
import { useLang } from "~/app/hooks/use-lang"
import { CONFIG_LANG_KEY } from "~/app/configs/lang-key.config"
import DraggableRow from "~/app/components/table-component/_components/draggable-row"

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
  compactChild?: string
  subKeyChildren?: string
  search?: boolean
  valueSearch?: string
  onChangeSearch?: (value: string) => void
  keyDnd?: string
  dataIdsDnd?: UniqueIdentifier[]
  onChangeDragEnd?: (event: DragEndEvent) => void
  draggingMode?: boolean
  pagination?: boolean
  pageNumber?: number
  pageSize?: number
  totalPages?: number
  onPaginationChange?: (pagination: { pageNumber?: number; pageSize?: number }) => void
  optionsFilter?: OptionDropdown[]
  gridBorder?: boolean
  optionActive?: OptionDropdownActive
  defaultRowsLoading?: number
  componentFilter?: React.ReactNode
  externalRowSelection?: Record<string, boolean>
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  renderRow?: (row: any) => JSX.Element
}

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
  onRowSelectionChange,
}: Readonly<TableProps<TData, TValue>>) {
  const { isLoadingLang, getLangKey } = useLang()
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(externalRowSelection || {})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [activeDropdown, setActiveDropdown] = React.useState(optionActive?.key ?? "all")

  const [pagination, setPagination] = React.useState({
    pageIndex: pageNumber ? pageNumber - 1 : 0,
    pageSize: pageSize ?? 10,
  })

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    const newValue = updaterOrValue instanceof Function ? updaterOrValue(rowSelection) : updaterOrValue
    setRowSelection(newValue)
    onRowSelectionChange?.(newValue)
  }

  const table = useReactTable({
    data: data,
    columns,
    state: { 
      rowSelection, 
      globalFilter, 
      sorting, 
      expanded, 
      ...(showPagination && { pagination }) 
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId: (row: any) => row.id,
    ...(showPagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
    }),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: (row: any) => {
      if (typeof subKeyChildren === "string") {
        return row[subKeyChildren]
      } else {
        return row
      }
    },
  })

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const keyboardSensor = useSensor(KeyboardSensor, {})

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  const getPageNumbers = () => {
    const pages = []
    const visiblePages = 5

    if (table.getPageCount() <= visiblePages) {
      for (let i = 1; i <= table.getPageCount(); i++) {
        pages.push(i)
      }
    } else {
      if (table.getState().pagination.pageIndex <= 3) {
        for (let i = 1; i <= visiblePages; i++) {
          pages.push(i)
        }
      } else if (table.getState().pagination.pageIndex > table.getPageCount() - 4) {
        for (let i = table.getPageCount() - visiblePages + 1; i <= table.getPageCount(); i++) {
          pages.push(i)
        }
      } else {
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

    return pages
  }

  React.useEffect(() => {
    if (externalRowSelection !== undefined) {
      setRowSelection(externalRowSelection)
    }
  }, [externalRowSelection])

  const initialOptionActive = React.useMemo(
    () =>
      optionActive?.option ?? [
        {
          label: getLangKey(CONFIG_LANG_KEY.ERP365_ALL),
          key: "all",
        },
        {
          label: getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED),
          key: "inactive",
        },
        {
          label: getLangKey(CONFIG_LANG_KEY.ERP365_UNACTIVED),
          key: "unactive",
        },
      ],
    [isLoadingLang, getLangKey]
  )

  return (
    <Card className={cn("w-full", gridBorder && "border-2")}>
      {/* Header Section */}
      {(title || onAdd) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {!isLoadingLang ? (
                <CardTitle>{title}</CardTitle>
              ) : (
                <Skeleton className="h-6 w-48" />
              )}
              {!isLoadingLang && title && (
                <CardDescription>
                  {getLangKey(CONFIG_LANG_KEY.ERP365_TABLE_SCROLL)}
                </CardDescription>
              )}
            </div>
            {onAdd && (
              <div>
                {!isLoadingLang ? (
                  <Button onClick={onAdd} size="sm">
                    + {titleAdd}
                  </Button>
                ) : (
                  <Skeleton className="h-9 w-32" />
                )}
              </div>
            )}
          </div>
        </CardHeader>
      )}

      {/* Custom Filter Section */}
      {componentFilter && (
        <div className="px-6 pb-4">
          {componentFilter}
        </div>
      )}

      {/* Table Controls */}
      <CardContent className="space-y-4">
        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2">
            {search && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={getLangKey(CONFIG_LANG_KEY.ERP365_SEARCH)}
                  value={valueSearch ?? globalFilter}
                  onChange={(e) => {
                    if (onChangeSearch) {
                      onChangeSearch(e.target.value)
                    } else {
                      setGlobalFilter(e.target.value)
                    }
                  }}
                  className="pl-8"
                />
              </div>
            )}
            
            {optionActive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {optionActive.label ?? (
                      <>
                        {activeDropdown === "all"
                          ? getLangKey(CONFIG_LANG_KEY.ERP365_ALL)
                          : activeDropdown === "inactive"
                          ? getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED)
                          : getLangKey(CONFIG_LANG_KEY.ERP365_UNACTIVED)}
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {initialOptionActive.map((option) => (
                    <DropdownMenuItem
                      key={option.key}
                      onClick={() => {
                        optionActive.onChange?.(option.key)
                        setActiveDropdown(option.key)
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex gap-2">
            {optionsFilter?.map((item) => (
              <DropdownMenu key={item.key}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.option.map((option) => (
                    <DropdownMenuItem
                      key={option.key}
                      onClick={() => item.onChange?.(option.key)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>

        {/* Table */}
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={onChangeDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <div className={cn(
            "rounded-md border",
            draggingMode && "border-dashed border-primary"
          )}>
            <UITable>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) =>
                  isLoadingLang ? (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <TableHead key={index} style={{ width: header.column.getSize() }}>
                          <Skeleton className="h-4 w-full" />
                        </TableHead>
                      ))}
                    </TableRow>
                  ) : (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ width: header.column.getSize() }}
                          className={cn(
                            "text-muted-foreground font-medium uppercase text-xs",
                            header.column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  )
                )}
              </TableHeader>
              <TableBody>
                {loading || isLoadingLang ? (
                  Array.from({ length: defaultRowsLoading }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: table.getHeaderGroups()[0].headers.length }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <span className="text-lg font-medium">
                          {getLangKey(CONFIG_LANG_KEY.ERP365_DATA_NOT_AVAILABLE)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext items={dataIdsDnd ?? []} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row, index) => (
                      <DraggableRow
                        key={index}
                        row={row}
                        dndKey={keyDnd ?? ""}
                        draggingMode={draggingMode}
                        compactChild={compactChild}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </UITable>
          </div>
        </DndContext>

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && showPagination && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              {table.getState().pagination.pageSize <= 20 && (
                <>
                  <p className="text-sm font-medium">
                    {getLangKey(CONFIG_LANG_KEY.ERP365_ROW_PER_PAGE)}:
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8">
                        {table.getState().pagination.pageSize}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {[10, 15, 20].map((size) => (
                        <DropdownMenuItem
                          key={size}
                          onClick={() => table.setPageSize(size)}
                        >
                          {size}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={table.getState().pagination.pageIndex + 1 === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}