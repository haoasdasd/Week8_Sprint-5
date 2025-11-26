import classNames from 'classnames/bind'
import styles from './comming-soon.module.scss'

const cx = classNames.bind(styles)
export default function CommingSoon() {
    return (
        <div className={cx('body')}>
            <div className={cx('box')}>
                <h3>
                    Trang hiện đang được cập nhật <i className='ri-robot-2-line'></i>
                </h3>
                <p>Chúng tôi đang làm việc để cải thiện trang của bạn. Xin vui lòng quay lại sau.</p>
            </div>
        </div>
    )
}
