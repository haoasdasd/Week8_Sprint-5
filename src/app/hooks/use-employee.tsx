import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { bankQueryApi } from '~/app/apis/bank/query/bank.query.api'
import { companyQueryApi } from '~/app/apis/company/query/company.query.api'
import { degreeQueryApi } from '~/app/apis/degree/query/degree.query.api'
import { employeeRoleQueryApi } from '~/app/apis/employee-role/query/employee-role.query.api'
import { maritalQueryApi } from '~/app/apis/marital/query/marital.query.api'
import { nationQueryApi } from '~/app/apis/nation/query/nation.query.api'
import { religionQueryApi } from '~/app/apis/religion/query/religion.query.api'
import { trainingMajorQueryApi } from '~/app/apis/training-major/query/training-major.query.api'
import { webLocalDistrictQueryApi } from '~/app/apis/web-local-district/query/web-local-district.query.api'
import { webLocalProvinceQueryApi } from '~/app/apis/web-local-province/query/web-local-province.query.api'
import { webLocalWardQueryApi } from '~/app/apis/web-local-ward/query/web-local-ward.query.api'
import { webLocalQueryApi } from '~/app/apis/web-local/query/web-local.query.api'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { BankType } from '~/app/types/bank/response/bank.type'
import { CompanyType } from '~/app/types/company/response/company.type'
import { DegreeType } from '~/app/types/degree/response/degree.type'
import { EmployeeRoleType } from '~/app/types/employee-role/response/employee-role.type'
import { MaritalType } from '~/app/types/marital/response/marital.type'
import { NationType } from '~/app/types/nation/response/nation.type'
import { ReligionType } from '~/app/types/religion/response/religion.type'

import { WebLocalDistrictType } from '~/app/types/web-local-district/response/web-local-district.type'
import { WebLocalProvinceType } from '~/app/types/web-local-province/response/web-local-province.type'
import { WebLocalWardType } from '~/app/types/web-local-ward/response/web-local-ward.type'
import { WebLocalType } from '~/app/types/web-local/response/web-local.type'
import { AccessEmployeeType, emAccessQueryApi } from '../apis/em-acess/query/em-access-query.api'
import { joinName, joinNameWithCode } from '../utils/format.util'
import { TrainingMajorType } from '../types/training-major/response/training-major.type'

export const useEmployee = () => {
    const [selectedCountry, setSelectedCountry] = useState<{ local: string; province: number; district: number; ward: number }>({
        local: '',
        province: 0,
        district: 0,
        ward: 0
    })

    // Locals
    const { data: locals } = useQuery<WebLocalType[]>({
        queryKey: [TANSTACK_KEY.WEB_LOCAL_ALL],
        queryFn: () => webLocalQueryApi.getAllWebLocal()
    })
    const listLocals = useMemo(() => locals?.map((item) => ({ label: item.localization, value: String(item.id) })), [locals])

    // Provinces
    const { data: provinces } = useQuery<WebLocalProvinceType[]>({
        queryKey: [TANSTACK_KEY.WEB_LOCAL_PROVINCE_ALL, selectedCountry.local],
        queryFn: () => webLocalProvinceQueryApi.getAllWebLocalProvince({ localization: selectedCountry.local }),
        enabled: !!selectedCountry.local
    })
    const listProvinces = useMemo(
        () => provinces?.map((item) => ({ label: item.provinceName, value: String(item.id) })),
        [provinces, selectedCountry.local]
    )

    const { data: provincesAll } = useQuery<WebLocalProvinceType[]>({
        queryKey: [TANSTACK_KEY.WEB_LOCAL_PROVINCE_ALL],
        queryFn: () => webLocalProvinceQueryApi.getAllWebLocalProvince({ localization: '' })
    })
    const listProvincesAll = useMemo(
        () => provincesAll?.map((item) => ({ label: item.provinceName, value: String(item.id) })),
        [provincesAll]
    )

    // Districts
    const { data: districts } = useQuery<WebLocalDistrictType[]>({
        queryKey: [TANSTACK_KEY.WEB_LOCAL_DISTRICT_ALL, selectedCountry.province],
        queryFn: () => webLocalDistrictQueryApi.getAllWebLocalDistrict({ provinceId: selectedCountry.province }),
        enabled: !!selectedCountry.province
    })
    const listDistricts = useMemo(
        () => districts?.map((item) => ({ label: item.districtName, value: String(item.id) })),
        [districts, selectedCountry.province]
    )

    // Wards
    const { data: wards } = useQuery<WebLocalWardType[]>({
        queryKey: [TANSTACK_KEY.WEB_LOCAL_WARD_ALL, selectedCountry.district],
        queryFn: () => webLocalWardQueryApi.getAllWebLocalWard({ districtId: selectedCountry.district }),
        enabled: !!selectedCountry.district
    })
    const listWards = useMemo(
        () => wards?.map((item) => ({ label: item.wardName, value: String(item.id) })),
        [wards, selectedCountry.district]
    )

    // Degree
    const { data: degrees } = useQuery<DegreeType[]>({
        queryKey: [TANSTACK_KEY.DEGREE_ALL],
        queryFn: () => degreeQueryApi.getAllDegree()
    })
    const listDegrees = useMemo(() => degrees?.map((item) => ({ label: item.degreeName, value: String(item.id) })), [degrees])

    // Training Major
    const { data: trainingMajors } = useQuery<TrainingMajorType[]>({
        queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ALL],
        queryFn: () => trainingMajorQueryApi.getAllTrainingMajor()
    })
    const listTrainingMajors = useMemo(
        () => trainingMajors?.map((item) => ({ label: item.trainingMajorName, value: String(item.id) })),
        [trainingMajors]
    )

    // Employee Role & Employees
    const { data: employeeRoles } = useQuery<EmployeeRoleType[]>({
        queryKey: [TANSTACK_KEY.EMPLOYEE_ROLE_ALL],
        queryFn: () => employeeRoleQueryApi.getAllEmployeeRole()
    })
    const listEmployeeRoles = useMemo(
        () => employeeRoles?.map((item) => ({ label: item.empRoleName, value: String(item.id) })),
        [employeeRoles]
    )

    const { data: employees } = useQuery({
        queryKey: ['GET_EMPLOYEE_ACCESS'],
        queryFn: () => emAccessQueryApi.getAllEmAccess()
    })
    const listEmployees = useMemo(
        () =>
            (employees as AccessEmployeeType[])?.map((item) => ({
                label: joinNameWithCode(item.employee.empFirstName, item.employee.empLastName, item.employee.empCode),
                value: String(item.employeeId),
                employeeFullName: joinName(item?.employee?.empFirstName, item?.employee?.empLastName),
                employeeCode: item?.employee?.empCode
            })),
        [employees]
    )
    // Bank
    const { data: banks } = useQuery<BankType[]>({
        queryKey: [TANSTACK_KEY.BANK_ALL],
        queryFn: () => bankQueryApi.getAllBank()
    })
    const listBanks = useMemo(() => banks?.map((item) => ({ label: item.bankName, value: String(item.id) })), [banks])

    // Nation
    const { data: nations } = useQuery<NationType[]>({
        queryKey: [TANSTACK_KEY.NATION_ALL],
        queryFn: () => nationQueryApi.getAllNation()
    })
    const listNations = useMemo(() => nations?.map((item) => ({ label: item.nationName, value: String(item.id) })), [nations])

    // Religion
    const { data: religions } = useQuery<ReligionType[]>({
        queryKey: [TANSTACK_KEY.RELIGION_ALL],
        queryFn: () => religionQueryApi.getAllReligion()
    })
    const listReligions = useMemo(
        () => religions?.map((item) => ({ label: item.religionName, value: String(item.id) })),
        [religions]
    )

    // Marital
    const { data: maritals } = useQuery<MaritalType[]>({
        queryKey: [TANSTACK_KEY.MARITAL_ALL],
        queryFn: () => maritalQueryApi.getAllMarital()
    })
    const listMaritals = useMemo(() => maritals?.map((item) => ({ label: item.maritalName, value: String(item.id) })), [maritals])

    // Companies
    const { data: companies } = useQuery({
        queryKey: [TANSTACK_KEY.COMPANY_ALL],
        queryFn: () => companyQueryApi.getAllCompany()
    })
    const listCompanies = useMemo(
        () => (companies as CompanyType[])?.map((item) => ({ label: item.name, value: String(item.id) })),
        [companies]
    )

    const { data: employeeeAcess } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_PAGINATION_ALL],
        queryFn: () => emAccessQueryApi.getAllEmAccess()
    })

    const listEmployeesAcess = useMemo(
        () =>
            employeeeAcess?.map((item) => ({
                label: joinNameWithCode(item.employee.empFirstName, item.employee.empLastName, item.employee.empCode),
                value: String(item.employeeId),
                employeeFullName: joinName(item?.employee?.empFirstName, item?.employee?.empLastName),
                employeeCode: item?.employee?.empCode
            })),
        [employeeeAcess]
    )

    return {
        selectedCountry,
        setSelectedCountry,
        listLocals,
        listProvinces,
        listDistricts,
        listWards,
        listDegrees,
        listTrainingMajors,
        listBanks,
        listNations,
        listReligions,
        listMaritals,
        listEmployeeRoles,
        listProvincesAll,
        listCompanies,
        listEmployees,
        listEmployeesAcess
    }
}
