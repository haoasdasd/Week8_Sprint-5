import { BeautyServiceType } from '~/app/types/beauty-service/response/beauty-service.type'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'

export function extractLevel0And1(menuCatalog: MenuCatalogType[]) {
    return menuCatalog.flatMap((item) => {
        const level0 = {
            ...item,
            level: 0,
            menuCatalogChildren: [] // Get Parent
        }

        const level1 = item.menuCatalogChildren.map((child) => ({
            ...child,
            level: 1,
            menuCatalogChildren: [] // Remove Children level 1
        }))

        return [level0, ...level1]
    })
}

export function getMenuCatalogDepth(menu: MenuCatalogType): number {
    if (!menu.menuCatalogChildren || menu.menuCatalogChildren.length === 0) {
        return 1
    }

    const childDepths = menu.menuCatalogChildren.map(getMenuCatalogDepth)
    return 1 + Math.max(...childDepths)
}

export function extractLevel0And1Beauty(menuCatalog: BeautyServiceType[]) {
    return menuCatalog.flatMap((item) => {
        const level0 = {
            ...item,
            level: 0,
            beautyServiceChildren: [] // Get Parent
        }

        const level1 = item.beautyServiceChildren.map((child) => ({
            ...child,
            level: 1,
            beautyServiceChildren: [] // Remove Children level 1
        }))

        return [level0, ...level1]
    })
}

export const buildBeautyServiceTree = (services: BeautyServiceType[]): BeautyServiceType[] => {
    const serviceMap = new Map<number, BeautyServiceType>()

    // Bước 1: Khởi tạo map để dễ tra cứu và thêm mảng con mặc định
    services.forEach((service) => {
        service.beautyServiceChildren = []
        serviceMap.set(service.id, service)
    })

    const roots: BeautyServiceType[] = []

    // Bước 2: Gắn con vào cha hoặc thêm vào gốc nếu không có cha
    services.forEach((service) => {
        if (service.servPid !== null && serviceMap.has(service.servPid)) {
            const parent = serviceMap.get(service.servPid)!
            parent.beautyServiceChildren.push(service)
        } else {
            roots.push(service)
        }
    })

    return roots
}
