export interface CreateMenuCatalogRequestType {
    menuPid: number
    menuName: string
    menuNameEn: string
    menuLink: string
    menuOrder: number
    isActived: boolean
}

export interface UpdateMenuCatalogRequestType {
    menuPid?: number
    menuName?: string
    menuNameEn?: string
    menuLink?: string
    menuOrder?: number
    isActived?: boolean
}

export interface GetAllMenuCatalogRequestType {
    MenuParentId: boolean
    isActived: boolean | null
}
