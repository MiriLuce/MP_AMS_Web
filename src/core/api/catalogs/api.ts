import { apiClient } from '@/core/api/client'
import type {
  DepartmentResponse,
  DistrictResponse,
  PhoneTypeResponse,
  ProvinceResponse,
} from './types'

const BASE = '/v1/personmanagement'

export function getDepartments() {
  return apiClient
    .get<DepartmentResponse[]>(`${BASE}/departments`)
    .then((response) => response.data)
}

export function getProvinces(departmentId: number) {
  return apiClient
    .get<ProvinceResponse[]>(`${BASE}/provinces`, { params: { departmentId } })
    .then((response) => response.data)
}

export function getDistricts(departmentId: number, provinceId: number) {
  return apiClient
    .get<DistrictResponse[]>(`${BASE}/districts`, { params: { departmentId, provinceId } })
    .then((response) => response.data)
}

export function getPhoneTypes() {
  return apiClient.get<PhoneTypeResponse[]>(`${BASE}/phone-types`).then((response) => response.data)
}
