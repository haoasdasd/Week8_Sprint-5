import classNames from 'classnames/bind'
import styles from './badge-component.module.scss'
import { BadgeProps as BootstrapBadgeProps, Badge as BootstrapBadge } from 'reactstrap'

interface BadgeProps extends BootstrapBadgeProps {
    outline?: boolean
    rounded?: boolean
    leftBorder?: boolean
    soft?: boolean
}

const cx = classNames.bind(styles)
export default function Badge({ outline = false, rounded = false, leftBorder = false, soft = false, ...props }: BadgeProps) {
    const color = props.color
    const softType = 'soft' + color?.charAt(0).toUpperCase() + color?.slice(1).toLowerCase()

    return (
        <BootstrapBadge
            className={cx('badge', color, soft && softType, {
                outline: outline,
                rounded: rounded,
                leftBorder: leftBorder
            })}
            {...props}
        />
    )
}
