import styles from './fallback-remote-page.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function FallbackRemote() {
    return (
        <div className={cx('wrap')}>
            <div>
                <h2>
                    <i className='ri-signal-wifi-error-line'></i>
                    Load remote component failed, please check configuration and network.
                </h2>
            </div>
        </div>
    )
}
