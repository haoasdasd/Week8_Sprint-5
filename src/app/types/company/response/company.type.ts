import { CompanySchemaType } from '~/app/schemas/company.schema'
import { GeneralDepartmentType } from '~/app/types/general-department/response/general-department.type'
import { PositionsType } from '~/app/types/positions/response/positions.type'
import { WebLocalDistrictType } from '~/app/types/web-local-district/response/web-local-district.type'
import { WebLocalProvinceType } from '~/app/types/web-local-province/response/web-local-province.type'
import { WebLocalWardType } from '~/app/types/web-local-ward/response/web-local-ward.type'
import { WebLocalType } from '~/app/types/web-local/response/web-local.type'

export interface CompanyType extends CompanySchemaType {
    id: number
    image: string
    ceoImage: string
    departments: GeneralDepartmentType[]
    positions: PositionsType[]
    countryName: string
    ward: {
        webLocalInfo: WebLocalType
        localProvinceInfo: WebLocalProvinceType
        localDistrictInfo: WebLocalDistrictType
        localWardInfo: WebLocalWardType
    }
}
