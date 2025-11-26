import axios, { AxiosInstance } from 'axios'
import { LoginResponseType } from '../types/auth/response/auth.type'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'

class Http {
    instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        })

        this.instance.interceptors.request.use((config) => {
            // Temp fix
            const token = (JSON.parse(sessionStorage.getItem(STORAGE_KEY.SESSION_PROFILE) || '{}') as LoginResponseType).token
            if (token) {
                // console.log('config token', token)
                config.headers.authorization = `Bearer ${token}`
            }
            return config
        })

        this.instance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                if (!error.response) {
                    return Promise.reject({ message: CONFIG_LANG_KEY.ERP365_SERVER_ERROR })
                }
                const message = error.response.data
                return Promise.reject({
                    message:
                        CONFIG_LANG_KEY[message.messageCode as keyof typeof CONFIG_LANG_KEY] ??
                        CONFIG_LANG_KEY.ERP365_SERVER_ERROR
                })
            }
        )
    }
}

const http = new Http().instance
export default http
