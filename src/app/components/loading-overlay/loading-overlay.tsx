import { FC, ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './loading-overlay.module.scss'

const cx = classNames.bind(styles)

interface LoadingOverlayProps {
    isLoading: boolean
    isClosing: boolean
    loadingText: ReactNode
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ isLoading, isClosing, loadingText }) => {
    if (!isLoading) return null

    return (
        <div className={cx('loadingOverlay', { closing: isClosing })}>
            <div className={cx('wrapLoading')}>
                <div className={cx('loader')}></div>
                <div className={cx('loadingText')}>{loadingText}</div>
            </div>
        </div>
    )
}

export default LoadingOverlay
