export interface ResponseMessageType<T> {
    data: T
    statusCode: number
    isSuccess: boolean
}
