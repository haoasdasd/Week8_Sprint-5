export interface SidebarItem {
    parentId?: string
    key: string
    label: string
    link?: string
    icon?: string
    items?: SidebarItem[]
    click?: () => void
    active: boolean
}

export interface SidebarSection {
    label: string
    isHeader?: boolean
    items?: SidebarItem[]
}
