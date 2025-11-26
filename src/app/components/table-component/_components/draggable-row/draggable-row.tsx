/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender, Row } from '@tanstack/react-table'
import { CSSProperties, memo, useEffect, useState } from 'react'
import styles from './draggale-row.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface DraggableRowProps {
    row: Row<any>
    dndKey: string
    draggingMode: boolean
    compactChild?: string
    gridBorder?: boolean
    index?: number
}

// Memoise the component to prevent unnecessary re-renders
const DraggableRow = memo(function DraggableRow({
    row,
    dndKey,
    draggingMode = false,
    compactChild,
    gridBorder = false,
    index
}: DraggableRowProps) {
    // Get the ID from the row
    const rowId = row.original[dndKey]
    // Check if this is a child menu
    const isChildMenu = draggingMode && row.depth > 0

    // Track active state
    const [isActive, setIsActive] = useState(false)

    // Set active state for child menu rows when selected
    useEffect(() => {
        if (isChildMenu && row.getIsSelected()) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }, [isChildMenu, row.getIsSelected()])

    const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
        id: rowId,
        data: draggingMode
            ? {
                  ...row.original,
                  depth: row.depth
              }
            : row.original,
        // Dragging behavior depends on the context
        disabled: false
    })

    // Apply special styles only for MenuCatalog
    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? (draggingMode ? 0.7 : 0.9) : 1,
        zIndex: isDragging ? (draggingMode ? 2 : 0) : 0,
        position: 'relative',
        backgroundColor: isChildMenu ? (isActive ? '#eaeaea' : '#f9f9f9') : undefined,
        cursor: isDragging ? 'grabbing' : 'inherit',
        padding: '0 10px',
        height: 40
    }

    // For regular tables, use a simpler row
    if (!draggingMode) {
        return (
            <tr
                ref={setNodeRef}
                style={{
                    ...style,
                    cursor: 'default',
                    background: gridBorder ? (Number(index) % 2 === 0 ? '#f5f5f5' : '#fff') : 'transparent'
                }}
            >
                {row.getVisibleCells().map((cell) => (
                    <td
                        key={cell.id}
                        style={{ width: cell.column.getSize(), height: 40 }}
                        className={cx('cell', { childMenuCell: isChildMenu })}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
            </tr>
        )
    }

    // Click handler for row selection
    const handleRowClick = () => {
        if (isChildMenu) {
            row.toggleSelected(!row.getIsSelected())
        }
    }

    // Enhanced version for MenuCatalog
    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={cx('draggableRow', {
                dragging: isDragging,
                childMenuRow: isChildMenu,
                activeRow: isActive,
                gridBorder: gridBorder
            })}
            onClick={handleRowClick}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    style={{
                        width: cell.column.getSize()
                    }}
                    className={cx(
                        'cell',
                        isDragging ? 'cellDragging' : '',
                        {
                            childMenuCell: isChildMenu,
                            compact: row.depth > 0 && compactChild === cell.column.id,
                            compactLv2: row.depth > 1
                        },
                        isActive ? 'active-cell' : ''
                    )}
                    {...(cell.column.id === 'id' ? { ...attributes, ...listeners } : {})}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
})

export default DraggableRow
