import classNames from 'classnames/bind'
import styles from './button-icon-component.module.scss'
import { ButtonHTMLAttributes } from 'react'

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string
    size?: number
}

const cx = classNames.bind(styles)

export default function ButtonIcon(props: ButtonIconProps) {
    return (
        <button {...props} type='button' className={cx('btn')}>
            <i className={cx(props.icon)} style={{ fontSize: props.size }}></i>
        </button>
    )
}
