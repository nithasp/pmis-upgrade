export interface IProductDocumentRequest {
   purposeId: number
   productTypeId: number
   productGroupId: number
   cargoWharfageId: number
   mTonQty: number
   rTonQty: number
   packageAmount: number
   receiver: string
   cargoOwnerId: number
   berthType: string
}
