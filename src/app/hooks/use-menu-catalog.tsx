import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { menuCatalogQueryApi } from '~/app/apis/menu-catalog/query/menu-catalog.query.api'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'
import { extractLevel0And1 } from '~/app/utils/array.util'

export const useMenuCatalog = (id: number) => {
    const { data: menuCatalogs } = useQuery<MenuCatalogType[]>({
        queryKey: [TANSTACK_KEY.MENU_CATALOG_ALL],
        queryFn: () => menuCatalogQueryApi.getAllMenuCatalog({ MenuParentId: true, isActived: true })
    })

    const listMenuCatalogs = useMemo(
        () =>
            extractLevel0And1(menuCatalogs ?? [])
                .filter((item) => !item.menuName.startsWith('#'))
                .map((item) => ({
                    label: item.menuName,
                    value: String(item.menuId),
                    level: item.level
                })),
        [menuCatalogs]
    )

    const lastIndexMenuOrder = useMemo(() => {
        return menuCatalogs?.filter((item) => item.menuPid === id).length ?? 0
    }, [menuCatalogs, id])

    return { listMenuCatalogs, lastIndexMenuOrder }
}
