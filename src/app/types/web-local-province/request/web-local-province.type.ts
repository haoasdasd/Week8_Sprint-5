export interface GetAllWebLocalProvinceRequestType {
    localization: string | null
}

export interface CreateWebLocalProvinceRequestType {
    provinceName: string
    provinceNameEN: string
    provinceFullName: string
    provinceFullNameEN: string
    provinceLatitude: number
    provinceLongitude: number
    keyLocalization: string
}

export interface UpdateWebLocalProvinceRequestType {
    id?: number
    provinceName: string
    provinceNameEN: string
    provinceFullName: string
    provinceFullNameEN: string
    provinceLatitude: number
    provinceLongitude: number
    // key is web local
    keyLocalization: string
}
