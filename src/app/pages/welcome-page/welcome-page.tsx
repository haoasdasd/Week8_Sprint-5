import classNames from 'classnames/bind'
import { ReactIcon, WebpackIcon } from '~/app/assets/svgs'
import { useStoreExample } from '~/app/shared/user-example.shared'
import styles from './welcome-page.module.scss'
const cx = classNames.bind(styles)

export default function WelcomePage() {
    const { count, increment, decrement } = useStoreExample()

    return (
        <div className={cx('welcomePage')}>
            <div className={cx('grid')} />
            <div className={cx('glowingOrb')} />
            <h1 className={cx('welcomeText')}>Welcome to React App</h1>
            <div className={cx('logoGroup')}>
                <ReactIcon className={cx('reactLogo')} />
                <WebpackIcon className={cx('webpackLogo')} />
            </div>
            <div className={cx('counter')}>{count}</div>

            <div className={cx('buttonGroup')}></div>
        </div>
    )
}
