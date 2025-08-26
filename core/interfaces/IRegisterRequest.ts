import type { IUploadFile } from "./IUploadFile"

export interface IRegisterRequest {
   token: string
   email: string
   password: string
   confirmPassword: string
   address: string
   company: string
   fullName: string
   mobilePhone: string
   personType: string
   phone: string
   countryId: number | null
   provinceId: number | null
   stageProvince: string
   districtId: number | null
   subDistrictId: number | null
   tax: string
   zipCode: string
   uploadFiles: IUploadFile[]
}
