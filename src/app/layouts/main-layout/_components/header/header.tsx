import classNames from 'classnames/bind'
import { Fragment, useEffect } from 'react'
import styles from './header.module.scss'
import ToggleSidebar from '~/app/layouts/main-layout/_components/header/_components/toggle-sidebar/toggle-sidebar'
import ToggleTheme from '~/app/layouts/main-layout/_components/header/_components/toggle-theme'
import ToggleLanguage from '~/app/layouts/main-layout/_components/header/_components/toggle-language'
import ToggleProfile from '~/app/layouts/main-layout/_components/header/_components/toggle-profile'
import { useStoreHeader } from '~/app/shared/header.shared'
import Button from '~/app/components/button/button-component'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import Menu from '~/app/components/menu-component'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'
import Skeleton from '~/app/components/skeleton-component'
import ToggleSetting from '~/app/layouts/main-layout/_components/header/_components/toggle-setting'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import { getMenuCatalogDepth } from '~/app/utils/array.util'
import Dropdown from '~/app/components/dropdown-component'
import useAuthStore from '~/app/shared/auth.shared'

const cx = classNames.bind(styles)
export default function Header() {
    const { titleSubmit, titleClose, onSubmit, onCancel, isLoading, btnSubmit } = useStoreHeader()
    const { getLangKey, isLoadingLang, language } = useLang()
    const { stateLevel0, stateLevel1, stateLevel2, setStateLevel1, mode, setStateLevel0, setStateLevel2 } = useStoreSidebar()
    const navigate = useNavigate()
    const location = useLocation()
    const { menuCatalogs, findMenuLevel0, findMenuLevel1 } = Menu()

    // Get Info Company
    const { profileEmployee } = useAuthStore()

    const checkModeActive = ({ menuId, menuLink }: { menuId?: number; menuLink?: string }) => {
        if (mode === 'vertical') {
            // Example /company/add => result: company
            return location.pathname.split('/')[1] === menuLink?.split('/')[1] ? true : false
        } else {
            const stateLv0 = Number(sessionStorage.getItem(STORAGE_KEY.SESSION_STATE_LEVEL_0))
            return stateLevel0 === menuId || stateLv0 === menuId ? true : false
        }
    }

    const extractListMenuVerical = () => {
        const menuParent = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)

        // Check Menu AI Beauty
        if (menuParent?.menuLink === '/365ai-beauty') {
            return []
        }

        if (menuParent) {
            if (getMenuCatalogDepth(menuParent) === 3) {
                const menuLevel1 = menuParent.menuCatalogChildren.find((child) => child.id === stateLevel1)
                if (menuLevel1 && menuLevel1.menuCatalogChildren.length > 0) {
                    return menuLevel1.menuCatalogChildren
                }
            } else {
                return menuParent.menuCatalogChildren
            }
        }
        return []
    }

    const extractListMenuHorizontal = (parent: MenuCatalogType) => {
        if (getMenuCatalogDepth(parent) === 3) {
            return parent.menuCatalogChildren
        } else {
            return menuCatalogs
        }
    }

    const handleModeLinkVertical = (menuId: number) => {
        const menuParent = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)
        if (menuParent) {
            if (getMenuCatalogDepth(menuParent) === 3) {
                setStateLevel2(menuId)
            } else {
                setStateLevel1(menuId)
            }
        }
    }

    const handleModeLinkHorizontal = (parent: MenuCatalogType) => {
        if (!parent.menuName.startsWith('#')) {
            if (getMenuCatalogDepth(parent) <= 2) {
                setStateLevel0(parent.menuId)
                setStateLevel1(parent.menuCatalogChildren[0].id)
                navigate(parent.menuCatalogChildren[0].menuLink)
            } else {
                const menuLevel1 = parent.menuCatalogChildren.find((child) => child.menuId === stateLevel1)
                const menuLevel2 = menuLevel1?.menuCatalogChildren.find((child) => {
                    return child.menuId === stateLevel2
                })
                setStateLevel0(parent.menuId)
                if (menuLevel1) {
                    setStateLevel1(menuLevel1.id)
                }
                if (menuLevel2) {
                    setStateLevel2(menuLevel2.id)
                }
            }
        }
    }

    const checkShowNavigation = () => {
        const parent = findMenuLevel0(stateLevel0)
        if (parent) {
            if (getMenuCatalogDepth(parent) === 3) {
                const menuLevel1 = findMenuLevel1(stateLevel1)
                if (menuLevel1 && menuLevel1?.menuCatalogChildren.length === 0) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }

        return true
    }

    useEffect(() => {
        if (stateLevel0) {
            const menuCatalog = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)

            if (menuCatalog) {
                if (getMenuCatalogDepth(menuCatalog) === 2) {
                    setStateLevel1(menuCatalog.menuCatalogChildren[0].id)
                    navigate(menuCatalog.menuCatalogChildren[0].menuLink)
                }
            }
            if (!stateLevel1) {
                navigate(menuCatalogs?.find((parent) => parent.menuId === stateLevel0)?.menuCatalogChildren[0]?.menuLink ?? '#')
            }
        }
    }, [stateLevel0])

    useEffect(() => {
        if (stateLevel1) {
            const menuLevel1 = findMenuLevel1(stateLevel1)
            if (menuLevel1 && menuLevel1?.menuCatalogChildren.length > 0) {
                setStateLevel2(menuLevel1.menuCatalogChildren[0].id)
                navigate(menuLevel1.menuCatalogChildren[0].menuLink)
            }
        }
    }, [stateLevel1])

    return (
        <Fragment>
            <header className={cx('pageTopbar')}>
                <div className={cx('navbarHeader')}>
                    <div className={cx('navbarHeaderLeft')}>
                        {isLoadingLang ? <Skeleton style={{ width: '35px', height: '35px' }} /> : <ToggleSidebar />}
                        <div className={cx('navbarHeaderLeftTitle')}>
                            <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                                <span
                                    style={{ color: 'var(--success-color)' }}
                                >{`${profileEmployee.empFirstName} ${profileEmployee.empLastName} `}</span>
                                <span style={{ color: '#555' }}>({profileEmployee.empCode})</span>
                                <span className={cx('employeeCompanyName')}>, {profileEmployee?.employeeCompany?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('navbarHeaderRight')}>
                        {titleSubmit ? (
                            <Fragment>
                                {isLoadingLang ? (
                                    <Fragment>
                                        <Skeleton style={{ height: '35px', width: '64px' }} />
                                        <Skeleton style={{ height: '35px', width: '120px' }} />
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <Button size='lg' color='light' isLoading={false} onClick={onCancel}>
                                            {titleClose ?? getLangKey(CONFIG_LANG_KEY.ERP365_CANCEL)}
                                        </Button>
                                        <Button size='lg' color='success' isLoading={isLoading} onClick={onSubmit}>
                                            {titleSubmit}
                                        </Button>
                                    </Fragment>
                                )}
                            </Fragment>
                        ) : (
                            <Fragment>
                                {isLoadingLang ? (
                                    <Fragment>
                                        <Skeleton style={{ borderRadius: '50%', width: '35px', height: '35px' }} />
                                        <Skeleton style={{ borderRadius: '50%', width: '35px', height: '35px' }} />
                                        <Skeleton style={{ borderRadius: '50%', width: '35px', height: '35px' }} />
                                        <Skeleton style={{ height: '35px', width: '120px' }} />
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        {btnSubmit && (
                                            <Button size='lg' color='success' onClick={onSubmit}>
                                                {btnSubmit}
                                            </Button>
                                        )}
                                        <ToggleSetting />
                                        <ToggleLanguage />
                                        <ToggleTheme />
                                        <ToggleProfile />
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </div>
                </div>
                {findMenuLevel0(stateLevel0)?.menuLink !== '/365ai-beauty' && checkShowNavigation() && (
                    <div className={cx('navbarNavigation')}>
                        {isLoadingLang ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className={cx('navbarNavigationItem')}>
                                    <Skeleton style={{ width: '48px', marginTop: '6px' }} />
                                </div>
                            ))
                        ) : (
                            <Fragment>
                                {mode === 'vertical' &&
                                    extractListMenuVerical()?.map((menu) => {
                                        return (
                                            <Link
                                                key={menu.id}
                                                to={menu.menuLink}
                                                className={cx('navbarNavigationItem', {
                                                    active: checkModeActive({ menuLink: menu.menuLink })
                                                })}
                                                onClick={() => handleModeLinkVertical(menu.id)}
                                            >
                                                {language === 'langVN' ? menu.menuName : menu.menuNameEn}
                                            </Link>
                                        )
                                    })}
                                {mode === 'horizontal' &&
                                    menuCatalogs?.map((parent) => {
                                        if (getMenuCatalogDepth(parent) <= 2) {
                                            return (
                                                <div
                                                    key={parent.id}
                                                    className={cx('navbarNavigationItem', {
                                                        active: checkModeActive({ menuId: parent.menuId }),
                                                        compact: parent.menuName.startsWith('#')
                                                    })}
                                                    onClick={() => handleModeLinkHorizontal(parent)}
                                                >
                                                    {parent.menuName.startsWith('#') ? (
                                                        <div className={cx('separator')}></div>
                                                    ) : language === 'langVN' ? (
                                                        parent.menuName
                                                    ) : (
                                                        parent.menuNameEn
                                                    )}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <Dropdown
                                                    key={parent.id}
                                                    options={
                                                        extractListMenuHorizontal(parent)?.map((menu) => ({
                                                            key: String(menu.id),
                                                            label: language === 'langVN' ? menu.menuName : menu.menuNameEn
                                                        })) ?? []
                                                    }
                                                    onChange={(key) => {
                                                        const tempStateLv2 = stateLevel2
                                                        setStateLevel0(parent.menuId)
                                                        setStateLevel1(Number(key))
                                                        setStateLevel2(tempStateLv2)
                                                    }}
                                                >
                                                    <div
                                                        className={cx('navbarNavigationItem', {
                                                            active: checkModeActive({ menuId: parent.menuId }),
                                                            compact: parent.menuName.startsWith('#')
                                                        })}
                                                        onClick={() => handleModeLinkHorizontal(parent)}
                                                    >
                                                        {parent.menuName.startsWith('#') ? (
                                                            <div className={cx('separator')}></div>
                                                        ) : language === 'langVN' ? (
                                                            parent.menuName
                                                        ) : (
                                                            parent.menuNameEn
                                                        )}
                                                    </div>
                                                </Dropdown>
                                            )
                                        }
                                    })}
                            </Fragment>
                        )}
                    </div>
                )}
            </header>
        </Fragment>
    )
}
