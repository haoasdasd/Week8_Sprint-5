import { GetAllMenuCatalogRequestType } from '~/app/types/menu-catalog/request/menu-catalog.type'
import { MenuCatalogType } from '~/app/types/menu-catalog/response/menu-catalog.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const menuCatalogQueryApi = {
    getAllMenuCatalog: async (params?: GetAllMenuCatalogRequestType) => {
        const url = '/v1/sys/MenuCatalog'
        const response = (await http.get(url, { params })) as ResponseMessageType<MenuCatalogType[]>
        return response.data
    },
    getMenuCatalogById: async (id: number) => {
        const url = `/v1/sys/MenuCatalog/${id}`
        const response = (await http.get(url)) as ResponseMessageType<MenuCatalogType>
        return response.data
    }
}
