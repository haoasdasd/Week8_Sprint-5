"use client"

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/app/components/ui/table"
import { Skeleton } from "~/app/components/ui/skeleton"
import { useLang } from "~/app/hooks/use-lang"
import { CONFIG_LANG_KEY } from "~/app/configs/lang-key.config"
import { cn } from "~/lib/utils"

interface DraggableTableProps<TData> {
  columns: {
    id: string
    header: string | React.ReactNode
    cell?: (row: TData, index: number) => React.ReactNode
    size?: number
  }[]
  data: TData[]
  keyDnd: string
  dataIdsDnd?: UniqueIdentifier[]
  onChangeDragEnd?: (event: DragEndEvent) => void
  draggingMode?: boolean
  loading?: boolean
  defaultRowsLoading?: number
  emptyMessage?: string
  className?: string
}

export default function DraggableTable<TData>({
  columns,
  data,
  keyDnd,
  dataIdsDnd,
  onChangeDragEnd,
  draggingMode = false,
  loading = false,
  defaultRowsLoading = 5,
  emptyMessage,
  className,
}: Readonly<DraggableTableProps<TData>>) {
  const { getLangKey, isLoadingLang } = useLang()

  // Enhanced sensors configuration
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Only start dragging after moving 5px
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Wait this many ms before activating
      tolerance: 5, // Allow slight movement
    },
  })

  const keyboardSensor = useSensor(KeyboardSensor, {})

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  const renderRow = (row: TData, index: number) => (
    <TableRow
      key={`${keyDnd}-${index}`}
      className={cn(
        "transition-all duration-200 hover:bg-muted/50",
        draggingMode && "cursor-grab active:cursor-grabbing"
      )}
    >
      {columns.map((column) => (
        <TableCell
          key={column.id}
          style={{ width: column.size }}
          className="align-middle"
        >
          {column.cell ? column.cell(row, index) : (row as any)[column.id]}
        </TableCell>
      ))}
    </TableRow>
  )

  if (loading || isLoadingLang) {
    return (
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.size }}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: defaultRowsLoading }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragEnd={onChangeDragEnd}
      modifiers={[restrictToVerticalAxis]}
      {...(draggingMode
        ? {
            autoScroll: {
              threshold: { x: 0.2, y: 0.2 },
              acceleration: 10,
              interval: 5,
            },
          }
        : {})}
    >
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.size }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext items={dataIdsDnd ?? []} strategy={verticalListSortingStrategy}>
              {data.length > 0 ? (
                data.map((row, index) => renderRow(row, index))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="text-lg font-medium">
                        {emptyMessage || getLangKey(CONFIG_LANG_KEY.ERP365_DATA_NOT_AVAILABLE)}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
    </DndContext>
  )
}