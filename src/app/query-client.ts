/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            // refetchOnMount: false,
            refetchOnReconnect: true,
            placeholderData: (prev: any) => prev
        }
    }
})
