import classNames from 'classnames/bind'
import styles from './button-component.module.scss'
import { MouseEvent, ReactNode, useState } from 'react'
import { Button as BootstrapButton, ButtonProps as BootstrapButtonProps, Spinner } from 'reactstrap'
import { useTranslation } from 'react-i18next'

interface ButtonProps extends BootstrapButtonProps {
    children: ReactNode | string
    soft?: boolean
    outline?: boolean
    isLoading?: boolean
}

const cx = classNames.bind(styles)
export default function Button({ children, soft, outline, isLoading, className, disabled, ...props }: ButtonProps) {
    const [glows, setGlows] = useState<{ id: number; x: number; y: number }[]>([])
    const { t } = useTranslation()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        const newGlow = { id: Date.now(), x, y }

        setGlows((prevGlows) => [...prevGlows, newGlow])

        setTimeout(() => {
            setGlows((prevGlows) => prevGlows.filter((g) => g.id !== newGlow.id))
        }, 300)
        if (props.onClick) {
            props.onClick(event)
        }
    }

    const color = props.color
    const outlineType = 'outline' + color?.charAt(0).toUpperCase() + color?.slice(1).toLowerCase()
    const softType = 'soft' + color?.charAt(0).toUpperCase() + color?.slice(1).toLowerCase()

    return (
        <BootstrapButton
            onClick={handleClick}
            {...props}
            className={cx('btn', color, soft && softType, outline && outlineType, className)}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <div className={cx('loading')}>
                    <Spinner />
                    <span>{t('Loading')}...</span>
                </div>
            ) : (
                children
            )}
            {glows.map((glow) => (
                <span key={glow.id} className={cx('glowEffect')} style={{ top: glow.y, left: glow.x }} />
            ))}
        </BootstrapButton>
    )
}
