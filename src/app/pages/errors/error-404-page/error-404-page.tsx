import { Link } from 'react-router-dom'
import styles from './error-404-page.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

export default function Error404Page() {
    return (
        <div className={cx('wrap')}>
            <div className={cx('inner')}>
                <h1 className={cx('error')}>404 Not Found</h1>
                <p className={cx('line')}></p>
                <p className={cx('message')}>
                    The page you requested does not exist. <Link to={'/'}>Go to Home Page</Link>
                </p>
            </div>
        </div>
    )
}
