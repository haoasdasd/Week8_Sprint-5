import styles from './error-boundary.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function ErrorBoundaryPage() {
    return (
        <div className={cx('wrap')}>
            <div>
                <h2>
                    <i className='ri-error-warning-line'></i>
                    An error occurred with the remote component, please check and try again later.
                </h2>
            </div>
        </div>
    )
}
