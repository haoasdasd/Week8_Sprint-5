import { EmployeeVerifySchemaType } from '~/app/schemas/employee-verify.schema'
import { EmployeeType } from '~/app/types/employee/response/employee.type'

export interface EmployeeVerifyType extends EmployeeVerifySchemaType {
    id: number
    verImage: string
    employee: EmployeeType
    verCreatedDate: number
}
