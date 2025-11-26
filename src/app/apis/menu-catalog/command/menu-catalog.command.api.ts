import { CreateMenuCatalogRequestType, UpdateMenuCatalogRequestType } from '~/app/types/menu-catalog/request/menu-catalog.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'
import http from '~/app/utils/http.util'

export const menuCatalogCommandApi = {
    createMenuCatalog: async (body: CreateMenuCatalogRequestType) => {
        const url = '/v1/sys/MenuCatalog'
        const response = (await http.post(url, body)) as ResponseMessageType<null>
        return response.data
    },
    updateMenuCatalog: async (id: number, body: UpdateMenuCatalogRequestType) => {
        const url = `/v1/sys/MenuCatalog/${id}`
        const response = (await http.put(url, body)) as ResponseMessageType<null>
        return response.data
    },
    deleteMenuCatalog: async (id: number) => {
        const url = `/v1/sys/MenuCatalog/${id}`
        const response = (await http.delete(url)) as ResponseMessageType<null>
        return response.data
    }
}
