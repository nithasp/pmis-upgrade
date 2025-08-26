import type { IUploadFile } from "./IUploadFile";

export interface IUserSystem {
    id: number;
    email: string
    rightsType: string
    type: string;
    versionApp: string
    personType: string
    tax: string
    company: string
    fullName: string
    phone: string
    mobilePhone: string
    address: string
    countryId: number
    subDistrictId: number
    districtId: number
    provinceId: number
    stageProvince: string
    zipCode: string
    uploadFiles: IUploadFile[]
    status: string
    createdAt: string
    roleId: number
    roleName: string
    isAcceptedTerm: boolean
    isFirstLogin: boolean
    updatedAt: string
    createAt?: string
    enabled: boolean
}
