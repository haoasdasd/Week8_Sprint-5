import { APP_ROUTES } from '~/app/configs/routes.config'
import Bank from '~/app/pages/hrm/bank'
import ContractType from '~/app/pages/hrm/contract-type'
import Degree from '~/app/pages/hrm/degree'
import Employee from '~/app/pages/hrm/emp/employee'
import EmployeeAdd from '~/app/pages/hrm/emp/employee-add'
import EmployeeUpdate from '~/app/pages/hrm/emp/employee-update'
import EmployeeVerify from '~/app/pages/hrm/emp/employee-verify'
import HourPerDay from '~/app/pages/hrm/hour-per-day'
import HourPerWeek from '~/app/pages/hrm/hour-per-week'
import Marital from '~/app/pages/hrm/marital'
import Nation from '~/app/pages/hrm/nation'
import Religion from '~/app/pages/hrm/religion'
import TrainingMajor from '../pages/hrm/training-major'

export const hrRoute = [
    { path: APP_ROUTES.DEGREE, element: <Degree /> },
    { path: APP_ROUTES.CONTRACT_TYPE, element: <ContractType /> },
    { path: APP_ROUTES.TRAINING_MAJOR, element: <TrainingMajor /> },
    { path: APP_ROUTES.NATION, element: <Nation /> },
    { path: APP_ROUTES.BANK, element: <Bank /> },
    { path: APP_ROUTES.RELIGION, element: <Religion /> },
    { path: APP_ROUTES.MARITAL, element: <Marital /> },
    { path: APP_ROUTES.EMPLOYEE, element: <Employee /> },
    { path: APP_ROUTES.EMPLOYEE_ADD, element: <EmployeeAdd /> },
    { path: APP_ROUTES.EMPLOYEE_UPDATE, element: <EmployeeUpdate /> },
    { path: APP_ROUTES.EMPLOYEE_VERIFY, element: <EmployeeVerify /> },
    { path: APP_ROUTES.HOUR_PER_WEEK, element: <HourPerWeek /> },
    { path: APP_ROUTES.HOUR_PER_DAY, element: <HourPerDay /> }
]
