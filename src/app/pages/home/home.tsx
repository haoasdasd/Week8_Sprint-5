import classNames from 'classnames/bind'
import styles from './home.module.scss'
const cx = classNames.bind(styles)
export default function Home() {
    return <div className={cx('home')}>Home </div>
}
