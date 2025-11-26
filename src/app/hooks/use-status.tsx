import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { statusCatalogQueryApi } from '../apis/status-catalog/query/status-catalog.query.api'
import { useMemo } from 'react'

export const useStatus = () => {
    const { data: statusCatalog } = useQuery({
        queryKey: [TANSTACK_KEY.STATUS_CATALOG_ALL],
        queryFn: () => statusCatalogQueryApi.getAllStatusCatalog()
    })

    const listStatus = useMemo(() => {
        return statusCatalog?.map((item) => ({ label: item.statusName, value: item.id }))
    }, [statusCatalog])

    return {
        statusCatalog,
        listStatus
    }
}
