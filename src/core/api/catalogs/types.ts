export type DepartmentResponse = {
  departmentId: number
  name: string
  code: string
  isDefault: boolean
}

export type ProvinceResponse = {
  departmentId: number
  provinceId: number
  name: string
  code: string
  isDefault: boolean
}

export type DistrictResponse = {
  departmentId: number
  provinceId: number
  districtId: number
  name: string
  ubigeo: string
  isDefault: boolean
}

export type PhoneTypeResponse = {
  phoneTypeId: number
  name: string
}
