export interface IFilterVesselImportList {
   limit: number;
   page: number;
   search: string;
   status: string;
   created?: string;
   mooringDate?: string;
   unmooringDate?: string;
   vesselFlagId: number;
   vesselTypeId: number;
   berthId: number;
   jettyId: number;

   mooringDateBegin: string;
   mooringDateEnd: string;
   unmooringDateBegin: string;
   unmooringDateEnd: string;

   mooringDateVSBegin?: string;
   mooringDateVSEnd?: string;
   unmooringDateVSBegin?: string;
   unmooringDateVSEnd?: string;
   mooringDateVTBegin?: string;
   mooringDateVTEnd?: string;
   unmooringDateVTBegin?: string;
   unmooringDateVTEnd?: string;

   productName?: string;
   purposeTypeId?: number;
   Order: {
      column: string;
      dir: string;
   }[];
}

export interface IVesselImportList {
   id: number;
   email: string;
   rightsType: string;
   type: string;
   versionApp: string;
   personType: string;
   tax: string;
   company: string;
   fullName: string;
   phone: string;
   mobilePhone: string;
   address: string;
   countryId: number;
   subDistrictId: number;
   districtId: number;
   provinceId: number;
   stageProvince: string;
   zipCode: string;
   uploadFiles: any | null;
   status: string;
   createdAt: string;
   updatedAt: string;
   roleId: number | null;
   roleName: string;
   roleType: string;
   enabled: boolean;
   isAcceptedTerm: boolean;
   isFirstLogin: boolean;
}

export interface IVesselImportError {
   rowNo: number;
   vesselName: string;
   note: string;
}
