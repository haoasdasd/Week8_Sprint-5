import { EmployeeSchemaType } from '~/app/schemas/employee.schema'
import { WebLocalDistrictType } from '~/app/types/web-local-district/response/web-local-district.type'
import { WebLocalProvinceType } from '~/app/types/web-local-province/response/web-local-province.type'
import { WebLocalWardType } from '~/app/types/web-local-ward/response/web-local-ward.type'
import { WebLocalType } from '~/app/types/web-local/response/web-local.type'

export interface EmployeeType extends EmployeeSchemaType {
    id: number
    empImage: string
    bankName: string
    countryName: string
    degreeName: string
    empPlaceOfBirthName: WebLocalProvinceType
    empRoleName: string
    maritalStatusName: string
    nationName: string
    religionName: string
    traMajName: string
    ward: {
        webLocalInfo: WebLocalType
        localProvinceInfo: WebLocalProvinceType
        localDistrictInfo: WebLocalDistrictType
        localWardInfo: WebLocalWardType
    }
    employeeCompany: {
        taxCode: string
        name: string
        email: string
        website: string
        address: string
    }
}
