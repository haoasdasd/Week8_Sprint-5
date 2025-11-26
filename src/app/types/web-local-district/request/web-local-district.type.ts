export interface GetAllWebLocalDistrictRequestType {
    provinceId: number | null
}

export interface CreateWebLocalDistrictRequestType {
    districtName: string
    districtNameEN: string
    districtFullName: string
    districtFullNameEN: string
    districtLatitude: number
    districtLongitude: number
    provinceId: number
}

export interface UpdateWebLocalDistrictRequestType {
    id?: number
    districtName: string
    districtNameEN: string
    districtFullName: string
    districtFullNameEN: string
    districtLatitude: number
    districtLongitude: number
    provinceId: number
}
