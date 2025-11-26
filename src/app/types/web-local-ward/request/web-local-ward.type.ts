export interface CreateWebLocalWardRequestType {
    wardName: string
    wardNameEN: string
    wardFullName: string
    wardFullNameEN: string
    wardLatitude: number
    wardLongitude: number
    districtId: number
}

export interface UpdateWebLocalWardRequestType {
    id?: number
    wardName: string
    wardNameEN: string
    wardFullName: string
    wardFullNameEN: string
    wardLatitude: number
    wardLongitude: number
    districtId: number
}

export interface GetAllWebLocalWardRequestType {
    districtId: number | null
}
