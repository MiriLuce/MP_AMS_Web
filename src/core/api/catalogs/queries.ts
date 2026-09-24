import { queryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/core/api/errors'
import { getDepartments, getDistricts, getPhoneTypes, getProvinces } from './api'
import type {
  DepartmentResponse,
  DistrictResponse,
  PhoneTypeResponse,
  ProvinceResponse,
} from './types'

export const departmentsQueryOptions = queryOptions<DepartmentResponse[], ApiError>({
  queryKey: ['catalogs', 'departments'],
  queryFn: getDepartments,
  staleTime: Infinity,
})

export const provincesQueryOptions = (departmentId: number) =>
  queryOptions<ProvinceResponse[], ApiError>({
    queryKey: ['catalogs', 'provinces', departmentId],
    queryFn: () => getProvinces(departmentId),
    staleTime: Infinity,
  })

export const districtsQueryOptions = (departmentId: number, provinceId: number) =>
  queryOptions<DistrictResponse[], ApiError>({
    queryKey: ['catalogs', 'districts', departmentId, provinceId],
    queryFn: () => getDistricts(departmentId, provinceId),
    staleTime: Infinity,
  })

export const phoneTypesQueryOptions = queryOptions<PhoneTypeResponse[], ApiError>({
  queryKey: ['catalogs', 'phone-types'],
  queryFn: getPhoneTypes,
  staleTime: Infinity,
})
