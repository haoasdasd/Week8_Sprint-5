import { arrow, FloatingArrow, offset, Placement, useFloating, useHover, useInteractions } from '@floating-ui/react'
import React, { useRef } from 'react'

interface TooltipProps {
    showTooltip: boolean
    onChangeTooltip: (tooltip: boolean) => void
    arrow?: boolean
    placement?: Placement
    offsetNumber?: number
    label?: string | React.ReactNode
}

export const useTooltip = ({
    showTooltip,
    onChangeTooltip,
    offsetNumber,
    label,
    placement = 'right',
    arrow: isArrow = true
}: TooltipProps) => {
    const arrowRef = useRef(null)
    const { refs, floatingStyles, context } = useFloating({
        open: showTooltip,
        onOpenChange: onChangeTooltip,
        placement: placement,
        transform: true,
        middleware: [
            isArrow &&
                arrow({
                    element: arrowRef
                }),
            offset(offsetNumber ?? 14)
        ]
    })

    const hover = useHover(context)
    const { getReferenceProps, getFloatingProps } = useInteractions([hover])

    const divTooltip = (
        <div
            ref={refs.setFloating}
            style={{
                ...floatingStyles,
                backgroundColor: 'var(--body-contain-bg-color)',
                border: '1px solid var(--tooltip-border-color)',
                padding: '6px',
                borderRadius: '0.25rem',
                color: 'var(--body-color)',
                fontSize: '12px',
                zIndex: 1
            }}
            {...getFloatingProps()}
        >
            {isArrow && (
                <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    width={16}
                    height={8}
                    tipRadius={2}
                    fill='var(--body-contain-bg-color)'
                    stroke='var(--tooltip-border-color)'
                    strokeWidth={1}
                    style={{ right: 'calc(100% - 2px)' }}
                />
            )}
            {label}
        </div>
    )

    return { getReferenceProps, getFloatingProps, refs, floatingStyles, arrowRef, context, divTooltip }
}
