/* eslint-disable @typescript-eslint/no-explicit-any */
import { MESSAGES_POST } from '../../configs/message.config'
import { TANSTACK_KEY } from '../../configs/tanstack-key.config'

// Metadata for API command
export interface MetadataParamsInterceptor {
    requestMessageKey?: (typeof MESSAGES_POST)[keyof typeof MESSAGES_POST]
    requestApi?: string
    requestQueryKey?: string[]
}

// Reverse key-value of MESSAGES_POST
export type ReverseMessagesInterceptor<T> = {
    [K in keyof T]: T[K] extends T[keyof T] ? K : never
}[keyof T]

// Create metadata for API command
export interface CreateMetadataParams {
    requestApi?: string
    requestMessageKey?: string
    requestQueryKey?: Array<keyof typeof TANSTACK_KEY>
}

// Type for API client method
type ApiClientMethod = (request: any, metadata: any, callback: (err: unknown, response: any) => void) => void

// Type for API command parameters -> executeApiCommand function promise
export interface ApiCommandParams<T> {
    clientMethod: ApiClientMethod
    request: any
    metadataParams: MetadataParamsInterceptor
    defaultValue: T
    generateErrorMessageFn: (statusCode: number, messageCode: string) => string | undefined
}

// Request type for query parameters
export interface QueryParametersRequestType {
    pageNumber?: number
    pageSize?: number
    skip?: number
    take?: number
}

export interface ApiQueryPaginationResponseType<T> {
    totalItems: number
    pageNumber: number
    pageSize: number
    totalPages: number
    items: T
}
