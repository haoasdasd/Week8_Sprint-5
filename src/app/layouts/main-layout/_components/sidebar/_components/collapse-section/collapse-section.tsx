import classNames from 'classnames/bind'
import styles from './collapse-section.module.scss'

import { Link } from 'react-router-dom'
import Menu from '~/app/components/menu-component'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'
import Skeleton from '~/app/components/skeleton-component'
import { useLang } from '~/app/hooks/use-lang'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import useTranslationStore from '~/app/shared/lang.shared'
import { useTooltip } from '~/app/hooks/useTooltip'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { getMenuCatalogDepth } from '~/app/utils/array.util'

const cx = classNames.bind(styles)

interface CollapseItemProps {
    item: MenuCatalogType
    level: number
}

const CollapseItem = ({ item, level }: CollapseItemProps) => {
    const { menuCatalogs, findParent } = Menu()
    const { size, setStateLevel0, setStateLevel1, setStateLevel2, stateLevel0, stateLevel1, stateLevel2, mode } =
        useStoreSidebar()
    const [showTooltip, setShowTooltip] = useState(false)
    const handleShowTooltip = (tooltip: boolean) => {
        if (size === 70) {
            setShowTooltip(tooltip)
        }
    }

    const { language } = useTranslationStore()
    const { getReferenceProps, refs, divTooltip } = useTooltip({
        showTooltip,
        onChangeTooltip: handleShowTooltip,
        label: language === 'langVN' ? item.menuName : item.menuNameEn
    })

    const handleClickState = (id: number) => {
        if (level === 0 && mode === 'vertical') {
            if (stateLevel0 !== id) {
                setStateLevel0(id)
            }
        } else if (level === 1 && mode === 'vertical') {
            if (stateLevel1 !== id) {
                setStateLevel0(item.menuPid)
                setStateLevel1(id)
            }
        } else if (mode === 'horizontal') {
            const menuParent = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)

            if (menuParent) {
                if (getMenuCatalogDepth(menuParent) === 3) {
                    if (stateLevel2 !== id) {
                        setStateLevel2(id)
                    }
                } else {
                    if (stateLevel1 !== id) {
                        setStateLevel1(id)
                    }
                }
            }
        }
    }

    const checkActive = (level: number) => {
        if (mode === 'vertical') {
            if (level === 0) {
                return item.menuId === stateLevel0 ? true : false
            }
            if (level === 1) {
                return item.menuId === stateLevel1 ? true : false
            }
        } else {
            const menuParent = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)
            if (menuParent) {
                if (getMenuCatalogDepth(menuParent) === 3) {
                    return item.menuId === stateLevel2 ? true : false
                } else {
                    return item.menuId === stateLevel1 ? true : false
                }
            }
        }
        return false
    }

    useEffect(() => {
        if (size === 70) {
            const sidebarId = document.querySelector('#sidebar') as HTMLDivElement
            sidebarId.style.position = 'static'
            sidebarId.style.height = 'auto'
        } else {
            const sidebarId = document.querySelector('#sidebar') as HTMLDivElement
            sidebarId.style.position = 'sticky'
            sidebarId.style.height = ''
        }
    }, [size])

    const classIcon = level === 0 ? 'ri-checkbox-blank-circle-fill' : 'ri-subtract-line'

    return !item.menuName.startsWith('#') ? (
        <Fragment>
            <div className={cx(`sidebarNavItem`, `level${level}`, { tablet: size === 70 })}>
                <Link
                    ref={refs.setReference}
                    {...getReferenceProps()}
                    onClick={() => handleClickState(item.id)}
                    to={
                        mode === 'vertical'
                            ? findParent(item.menuPid)?.menuLink === '/365ai-beauty' || item.menuCatalogChildren.length === 0
                                ? item.menuLink
                                : '#'
                            : item.menuLink
                    }
                    className={cx(`sidebarNavContain`, {
                        tablet: size === 70,
                        active: checkActive(level)
                    })}
                >
                    <i className={cx(classIcon, `siderbarNavContainIconLeft`, { tablet: size === 70 })}></i>
                    <span className={cx(`siderbarNavContainText`)}>
                        {language === 'langVN' ? item.menuName : item.menuNameEn}
                    </span>
                </Link>
                {getMenuCatalogDepth(item) === 3 &&
                    size !== 70 &&
                    item.menuCatalogChildren.map((child) => <CollapseItem key={child.menuId} item={child} level={level + 1} />)}
            </div>
            {showTooltip && divTooltip}
        </Fragment>
    ) : (
        <div className={cx('separator')}></div>
    )
}

export default function CollapseSection() {
    const { menuCatalogs } = Menu()
    const { size, mode, stateLevel0, setStateLevel0, setStateLevel1, stateLevel1 } = useStoreSidebar()
    const { isLoadingLang, getLangKey } = useLang()

    useEffect(() => {
        setStateLevel0(Number(sessionStorage.getItem(STORAGE_KEY.SESSION_STATE_LEVEL_0)) ?? 0)
        setStateLevel1(Number(sessionStorage.getItem(STORAGE_KEY.SESSION_STATE_LEVEL_1)) ?? 0)
    }, [])

    const title = useMemo(
        () => menuCatalogs?.find((item) => item.id === stateLevel0)?.menuName ?? getLangKey(CONFIG_LANG_KEY.ERP365_MENU_CATALOG),
        [menuCatalogs, stateLevel0]
    )

    const extractListMenuSidebar = () => {
        if (mode === 'vertical') {
            return menuCatalogs?.filter((item) => item.menuLink !== '/365ai-beauty')
        }

        const menuParent = menuCatalogs?.find((parent) => parent.menuId === stateLevel0)
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

    return (
        <ul className={cx('sidebarNav', { tablet: size != 250 })}>
            {isLoadingLang ? (
                <div className={cx('skeletonTitle')}>
                    <Skeleton className={cx('skeletonTitleItem')} />
                </div>
            ) : (
                size === 250 && <span className={cx('sidebarNavTitle')}>{title}</span>
            )}
            {isLoadingLang ? (
                <div className={cx('skeletonBox')}>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className={cx('skeletonBoxItem')}>
                            <Skeleton className={cx('skeletonItem')} />
                        </div>
                    ))}
                </div>
            ) : (
                extractListMenuSidebar()?.map((item) => <CollapseItem key={item.id} item={item} level={0} />)
            )}
        </ul>
    )
}
