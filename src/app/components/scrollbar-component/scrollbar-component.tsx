import { ReactNode } from 'react'
import styles from './scrollbar-component.module.scss'
import classNames from 'classnames/bind'

interface ScrollbarProps {
    children: ReactNode
    height?: string
}

const cx = classNames.bind(styles)
export default function Scrollbar({ children, height = '100vh' }: ScrollbarProps) {
    return (
        <div className={cx('customScroll')} style={{ maxHeight: height }}>
            {children}
        </div>
    )
}
