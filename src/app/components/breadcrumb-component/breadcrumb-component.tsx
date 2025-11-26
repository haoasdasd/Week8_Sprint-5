import classNames from 'classnames/bind'
import styles from './breadcrumb-component.module.scss'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface BreadcrumProps {
    children?: ReactNode
    title: string
    pageTitle: string
}
const cx = classNames.bind(styles)
export default function Breadcrumb({ children, title, pageTitle }: BreadcrumProps) {
    return (
        <div className={cx('breadcrum')}>
            {children}
            <div className={cx('breadcrumBox')}>
                <ol className={cx('breadcrumBoxList')}>
                    <li className={cx('breadcrumBoxListItem')}>
                        <Link to={'#'}>{pageTitle ?? ''}</Link>
                    </li>
                    <li className={cx('breadcrumBoxListItem', 'active')}>{title}</li>
                </ol>
            </div>
        </div>
    )
}
