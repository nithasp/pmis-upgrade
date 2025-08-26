import type { IFileUpload } from "./IFileUpload";

export interface IUpdateUser {
   email?: string;
   code?: string;
   rightsType?: string;
   personType?: string;
   tax?: string;
   company?: string;
   fullName?: string;
   phone?: string;
   mobilePhone?: string;
   address?: string;
   countryId?: number;
   districtId?: number;
   subDistrictId?: number;
   provinceId?: number;
   stageProvince?: string;
   zipCode?: string | number;
   zipCodeTemp?: string | number;
   uploadFiles?: IFileUploadSetting[] | IFileUpload[];
}

export interface IUpdateUserAgent {
   email?: string;
   code?: string;
   rightsType?: string;
   personType?: string;
   tax?: string;
   company?: string;
   fullName?: string;
   phone?: string;
   mobilePhone?: string;
   address?: string;
   countryId?: number;
   districtId?: number;
   subDistrictId?: number;
   provinceId?: number;
   stageProvince?: string;
   zipCode?: string | number;
   zipCodeTemp?: string | number;
   uploadFiles?: IFileUpload[];
}

export interface IVerifyPassword {
   old_password: string;
}

export interface IResetPassword {
   password: string;
   confirm_password: string;
}

export interface ISendVerifyEmail {
   email: string;
}

export interface IFileUploadSetting {
   id?: number;
   mockId?: string;
   progress?: number;
   fileName: string;
   size: number;
   isError: boolean;
   filePath: string;
   preview: string;
}

export interface IUserAddressList {
   id: number;
   tax: string;
   company: string;
   fullName: string;
   paymentMethodId: number;
   paymentMethodDes: string;
   paymentTermId: number;
   paymentTermDes: string;
   address: string;
   countryId: number;
   countryDes: string;
   subDistrictId: number;
   subDistrictDes: string;
   districtId: number;
   districtDes: string;
   provinceId: number;
   provinceDes: string;
   stageProvince: string;
   zipCode: string;
}
