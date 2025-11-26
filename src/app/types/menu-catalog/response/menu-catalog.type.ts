export interface MenuCatalogType {
    menuId: number
    permission: boolean
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    menuCatalogChildren: MenuCatalogType[]
    menuPid: number
    menuName: string
    menuNameEn: string
    menuLink: string
    menuOrder: number
    isActived: boolean
    id: number
}
