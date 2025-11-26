import { create } from 'zustand'
import { CompanyType } from '~/app/types/company/response/company.type'
import { EmployeeType } from '~/app/types/employee/response/employee.type'

interface AuthStore {
    profileEmployee: EmployeeType
    setProfileEmployee: (me: EmployeeType) => void
    // Temporary
    profileCompany: CompanyType
    setProfileCompany: (company: CompanyType) => void
}

const useAuthStore = create<AuthStore>((set) => ({
    profileEmployee: {} as EmployeeType,
    setProfileEmployee: (profileEmployee: EmployeeType) => set({ profileEmployee }),
    // Temporary
    profileCompany: {} as CompanyType,
    setProfileCompany: (profileCompany: CompanyType) => set({ profileCompany })
}))

export default useAuthStore
