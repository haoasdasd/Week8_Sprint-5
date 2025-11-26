import { useEffect, useRef } from 'react'
import styles from './sidebar.module.scss'
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import Scrollbar from '~/app/components/scrollbar-component'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import CollapseSection from '~/app/layouts/main-layout/_components/sidebar/_components/collapse-section'
import logo from '~/app/assets/images/logo.jpg'
import avatar from '~/app/assets/images/avatar.jpg'
import { useLang } from '~/app/hooks/use-lang'
import Skeleton from '~/app/components/skeleton-component'

const cx = classNames.bind(styles)
export default function Sidebar() {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const { setSize, setIsMobile, isMobile, size, setStateLevel0 } = useStoreSidebar()
    const { isLoadingLang } = useLang()

    const setSidebarWidth = (width: number) => {
        if (sidebarRef.current) {
            sidebarRef.current.style.width = `${width}px`
        }
        setSize(width)
    }

    useEffect(() => {
        const hanldeResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarWidth(250)
                setIsMobile(false)
            } else if (window.innerWidth >= 768) {
                setSidebarWidth(70)
                setIsMobile(false)
            } else {
                setSidebarWidth(1)
                setIsMobile(true)
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                if (isMobile) {
                    if (sidebarRef.current.offsetWidth > 1) {
                        sidebarRef.current.style.width = '1px'
                        setSize(1)
                    }
                }
            }
        }

        window.addEventListener('mousedown', handleClickOutside)

        window.addEventListener('resize', hanldeResize)

        return () => {
            window.removeEventListener('resize', hanldeResize)
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobile])

    return (
        <div id='sidebar' ref={sidebarRef} className={cx('sidebar', { mobile: isMobile })}>
            <div className={cx('siderbarHeader')}>
                {isLoadingLang ? (
                    <Skeleton className={cx('skeletonHeaderLogo')} />
                ) : (
                    <Link to={'/'} className={cx('siderbarHeaderLogo')} onClick={() => setStateLevel0(0)}>
                        {size < 250 ? (
                            <img className={cx('imgAvatar')} src={avatar} height={'22px'} alt='' />
                        ) : (
                            <img height={26} src={logo} alt='logo' />
                        )}
                    </Link>
                )}
            </div>
            <Scrollbar height='calc(100vh - 70px)'>
                <CollapseSection />
            </Scrollbar>
            {size > 70 && <div className={cx('sidebarFooter')}>2025 © 365EJSC</div>}
        </div>
    )
}
