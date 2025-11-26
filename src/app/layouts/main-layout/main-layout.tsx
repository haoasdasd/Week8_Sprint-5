import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import Header from '~/app/layouts/main-layout/_components/header'
import Sidebar from '~/app/layouts/main-layout/_components/sidebar'
import useAuthStore from '~/app/shared/auth.shared'
import useTranslationStore from '~/app/shared/lang.shared'
import usePreviousUrlStore from '~/app/shared/previous-url.shared'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import useStoreTheme from '~/app/shared/theme.shared'
import { LoginResponseType } from '~/app/types/auth/response/auth.type'
import styles from './main-layout.module.scss'

const cx = classNames.bind(styles)
export default function MainLayout() {
    const { setSize, setIsMobile, isMobile, size } = useStoreSidebar()
    // Init theme
    const { theme, setTheme } = useStoreTheme()
    useEffect(() => {
        const localTheme = localStorage.getItem(STORAGE_KEY.LOCAL_THEME) as 'light' | 'dark' | null
        if (localTheme) {
            setTheme(localTheme)
        }
        document.querySelector('body')?.setAttribute('data-theme', theme)
    }, [theme])
    // Init language
    const { i18n } = useTranslation()
    const { setLanguage } = useTranslationStore()
    useEffect(() => {
        const lan = localStorage.getItem(STORAGE_KEY.LOCAL_LANGUAGE) as 'vn' | 'en'

        if (lan) {
            i18n.changeLanguage(lan)
            setLanguage(lan === 'vn' ? 'langVN' : 'langEN')
        }
    }, [])
    // Init Previous Url
    const location = useLocation()
    const { setPreviousUrl } = usePreviousUrlStore()

    useEffect(() => {
        setPreviousUrl(location.pathname.split('/')[1])
    }, [location])

    // Init Auth
    const sessionProfile = JSON.parse(sessionStorage.getItem(STORAGE_KEY.SESSION_PROFILE) ?? '{}') as LoginResponseType
    const { setProfileEmployee } = useAuthStore()
    useEffect(() => {
        const refeshMe = async () => {
            if (sessionProfile) {
                const response = await employeeQueryApi.getEmployeeById(sessionProfile.id)
                // setMe(response)
                setProfileEmployee(response)
            }
        }
        refeshMe()
    }, [])

    // Check window
    useEffect(() => {
        const sidebarRef = document.querySelector('#sidebar') as HTMLDivElement

        const setSidebarWidth = (width: number) => {
            if (sidebarRef) {
                sidebarRef.style.width = `${width}px`
            }
            setSize(width)
        }

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
    }, [])

    return (
        <div className={cx('mainLayout')}>
            <Sidebar />
            <div className={cx('mainLayoutContainer')} style={{ pointerEvents: isMobile && size > 1 ? 'none' : 'all' }}>
                <div className={cx({ overlay: isMobile, open: isMobile && size == 250 })}></div>
                <Header />
                <div className={cx('mainLayoutContent')}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
