import { checkCompanySchemaType } from '~/app/schemas/check-company.schema'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateCheckCompanyRequestType extends checkCompanySchemaType {}

export interface UpdateCheckCompanyRequestType extends checkCompanySchemaType {
    id?: number
}
