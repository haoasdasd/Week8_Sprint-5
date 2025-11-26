import { checkCompanySchemaType } from '~/app/schemas/check-company.schema'

export interface CheckCompanyType extends checkCompanySchemaType {
    id: number
}
