/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify'
import { HTTP_STATUS_CODES } from '../configs/http-status-code.config'
import { MESSAGE_ERROR, MESSAGES_POST } from '../configs/message.config'
import {
    ApiCommandParams,
    CreateMetadataParams,
    MetadataParamsInterceptor,
    ReverseMessagesInterceptor
} from '../types/utils/api.type'
import { parseData } from './format.util'

// Header token for metadata query
export const metadataQuery = {
    'Content-Type': 'application/grpc-web',
    Accept: 'application/grpc-web'
    // Authorization: `Bearer ${process.env.TOKEN_QUERY}`
}

// Header token for metadata command
export const metadataCommand = ({ requestMessageKey, requestApi, requestQueryKey }: MetadataParamsInterceptor) => {
    // Temp
    const token = ''
    const messageKey = requestMessageKey
        ? (Object.keys(MESSAGES_POST) as Array<ReverseMessagesInterceptor<typeof MESSAGES_POST>>).find(
            (k) => MESSAGES_POST[k] === requestMessageKey
        )
        : undefined

    if (requestMessageKey && !messageKey) {
        toast.error(MESSAGE_ERROR.INTERCEPTOR_NOT_FOUND_KEY)
    }

    return {
        'Content-Type': 'application/json; charset=utf-8',
        dataType: 'xml',
        Authorization: `Bearer ${token}`,
        ...(messageKey && { requestMessageKey: messageKey }),
        ...(requestApi && { requestApi }),
        ...(requestQueryKey && { requestQueryKey: requestQueryKey.join(', ') })
    }
}

// Get error message from error object
export const getErrorMessage = (error: unknown, defaultMessage: string = MESSAGE_ERROR.AN_UNEXPECTED_ERROR_OCCURRED): string => {
    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: unknown }).message)
    }

    return defaultMessage
}

// Handle response from API
export const handleResponse = <T>(
    response: any,
    defaultValue: T,
    generateErrorMessageFn?: (statusCode: number, messageCode: string) => string | undefined
): T => {
    try {
        if (response.getStatuscode() === HTTP_STATUS_CODES.OK) {
            const dataString = response?.getData?.()

            // If data is null, undefined or empty string, return default value
            if (dataString === null || dataString === undefined || dataString === '') {
                return defaultValue
            }

            // Parse data to object
            return parseData<T>(response, defaultValue)
        }

        // Generate error message
        // if (response.getStatuscode() == HTTP_STATUS_CODES.UNAUTHORIZED) {
        //     return defaultValue
        // }
        const message = generateErrorMessageFn && generateErrorMessageFn(response.getStatuscode(), response.getMessagecode())

        throw {
            statuscode: response.getStatuscode(),
            messagecode: response.getMessagecode(),
            message
        }
    } catch (error) {
        console.error(MESSAGE_ERROR.AN_UNEXPECTED_ERROR_OCCURRED, error)
        throw error
    }
}

// Execute API command with promise
export const executeApiCommand = <T>({
    clientMethod,
    request,
    metadataParams,
    defaultValue,
    generateErrorMessageFn
}: ApiCommandParams<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        clientMethod(request, metadataCommand(metadataParams), (err: unknown, response: any) => {
            if (err) {
                console.log('executeApiCommand -> err', err)
                // No reject becase it will return a 401 error and toast error
                // reject(err)
            } else {
                try {
                    // Auto handle response
                    const handledResponse = handleResponse(response, defaultValue, generateErrorMessageFn)
                    console.log('executeApiCommand -> handledResponse', response.getStatuscode(), response.getMessagecode())
                    resolve(handledResponse)
                } catch (error) {
                    console.error('executeApiCommand -> error', error)
                    reject(error)
                }
            }
        })
    })

// Create metadata params
export const createMetadataParams = ({ requestApi, requestMessageKey, requestQueryKey = [] }: CreateMetadataParams) => ({
    requestApi,
    requestMessageKey,
    requestQueryKey
})
