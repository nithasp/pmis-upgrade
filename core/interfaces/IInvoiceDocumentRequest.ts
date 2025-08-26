export interface IInvoiceDocumentRequest {
   customerId: number | null
   name: string
   taxId: string
   contactName: string
   paymentMethodId: number
   paymentTermId: number
   countryId: number
   subDistrictId: number
   districtId: number
   provinceId: number
   postCode: string
   stageProvince: string
   address: string
}
