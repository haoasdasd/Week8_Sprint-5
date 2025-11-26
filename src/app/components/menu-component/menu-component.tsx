import { useQuery } from '@tanstack/react-query'
import { menuCatalogQueryApi } from '~/app/apis/menu-catalog/query/menu-catalog.query.api'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import lodash from 'lodash'
import { useCallback } from 'react'
import useAuthStore from '~/app/shared/auth.shared'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'

export default function Menu() {
    const { profileEmployee } = useAuthStore()

    const { data: menuCatalogs, isLoading } = useQuery({
        queryKey: [TANSTACK_KEY.MENU_CATALOG_ALL, true, true],
        queryFn: () => menuCatalogQueryApi.getAllMenuCatalog({ MenuParentId: true, isActived: true }),
        select: (data) => {
            // Sort by menuOrder
            let sortedData = lodash.sortBy(data, 'menuOrder')

            if (profileEmployee?.empCode === 'VH0014' || profileEmployee?.empCode === 'VH0001') {
                const allowedLinks = ['/dashboard/beauty/monthly-statistics', '/commission-list']
                sortedData = sortedData.filter((item: MenuCatalogType) => {
                    // Keep the /beauty parent menu and filter its children
                    if (item.menuLink === '/beauty') {
                        item.menuCatalogChildren = item.menuCatalogChildren.filter((child) =>
                            allowedLinks.includes(child.menuLink)
                        )
                        return item.menuCatalogChildren.length > 0
                    }
                    return false // Exclude all other top-level menus
                })
            }

            return sortedData
        },
        // Hide menu for VH0014 during loading
        enabled: profileEmployee?.empCode === 'VH0014' || profileEmployee?.empCode === 'VH0001' ? !!profileEmployee : true
    })

    const findParent = useCallback(
        (parentId: number) => {
            return menuCatalogs?.find((item) => item.menuId === parentId)
        },
        [menuCatalogs]
    )

    const findMenuLevel0 = useCallback(
        (menuId: number) => {
            return menuCatalogs?.find((item) => item.menuId === menuId)
        },
        [menuCatalogs]
    )

    const findMenuLevel1 = useCallback(
        (menuId: number) => {
            for (const parent of menuCatalogs || []) {
                const child = parent.menuCatalogChildren?.find((item) => item.menuId === menuId)
                if (child) return child
            }
            return undefined
        },
        [menuCatalogs]
    )

    return {
        menuCatalogs,
        isLoading,
        findParent,
        findMenuLevel0,
        findMenuLevel1
    }
}
