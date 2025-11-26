import classNames from 'classnames/bind'
import styles from './skeleton-component.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

const cx = classNames.bind(styles)
export default function Skeleton({ className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
    return <span {...props} className={cx('skeleton', className)} />
}
