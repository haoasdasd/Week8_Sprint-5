import classNames from 'classnames/bind'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import styles from './toggle-sidebar.module.scss'

const cx = classNames.bind(styles)
export default function ToggleSidebar() {
    const { isMobile, setSize, size } = useStoreSidebar()
    // Toggle open/close sidebar
    const toggleSidebar = () => {
        const sidebarRef = document.querySelector('#sidebar') as HTMLDivElement

        if (sidebarRef.offsetWidth == 250) {
            if (isMobile) {
                sidebarRef.style.width = '1px'
                setSize(1)
            } else {
                sidebarRef.style.width = '70px'
                setSize(70)
            }
        } else if (sidebarRef.offsetWidth == 70) {
            sidebarRef.style.width = '250px'
            setSize(250)
        } else {
            sidebarRef.style.width = '250px'
            setSize(250)
        }
    }

    return (
        <button onClick={toggleSidebar} type='button' className={cx('toggleSidebar')}>
            {size <= 70 ? <i className='ri-arrow-right-line'></i> : <i className='ri-menu-line'></i>}
        </button>
    )
}
