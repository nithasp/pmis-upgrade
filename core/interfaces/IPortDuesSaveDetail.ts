export interface IPortDuesSaveDetail {
   id: number;
   documentId: number;
   docNumber: string;
   requestDate: string;
   status: string;
   statusKey: string;
   docType: string;
   portDueNumber: string;
   grossTonnage: number;
   berthAt: string;
   berthId: string;
   berthName: string;
   eta: string;
   etd: string;
   createdAt: string;
   invoice: Invoice;
   vessel: Vessel;
   refDocuments: RefDocments[]
}

interface RefDocments {
   createdAt: string;
   docType: string;
   dueDate: string | null;
   id: number;
   paidDate: string | null;
   portDueNumber: string;
   portDueRefId: string;
   total: number;
}

interface Vessel {
   vesselFlagId: number;
   vesselTypeId: number;
   id: number;
   documentVesselId: number;
   vesselId: number;
   vesselOwner: string;
   vesselOwnerId: number;
   vesselName: string;
   vesselImoNumber: string;
   vesselMMSiNumber: string;
   vesselDSVNumber: string;
   vesselOfficialNumber: string;
   vesselCallSign: string;
   vesselNationality: string;
   vesselCountry: string;
   vesselLoadWeight: number;
   vesselGrossTonnage: number;
   vesselNetTonnage: number;
   vesselLengthOverall: number;
   vesselBreadthExtreme: number;
   vesselDepth: number;
   vesselMainEngine: string;
   vesselBandAndModel: string;
   vesselLicenseExpiredDate: string;
   vesselFlagName: string;
   vesselFlagPath: string;
   vesselTypeName: string;
   vesselUploadFiles: any[];
}

interface Invoice {
   id: number;
   customerId: number;
   customerCode: string;
   customerReference: string;
   documentId: number;
   name: string;
   taxId: string;
   contactName: string;
   paymentMethodId: number;
   paymentMethodName: string;
   paymentTermId: number;
   paymentTermName: string;
   countryId: number;
   countryName: string;
   subDistrictId: number;
   subDistrictName: string;
   districtId: number;
   districtName: string;
   provinceId: number;
   provinceName: string;
   postCode: string;
   stageProvince: string;
   address: string;
   phoneNumber: string;
   secondaryPhoneNumber: string;
   rate: number;
   fee: number;
   vat: number;
   vatTotal: number;
   total: number;
   paymentPeriod: number;
   dueDate: string;
   paidDate: string | null;
}
