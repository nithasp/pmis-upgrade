export interface IBerthsDocumentRequest {
   berthId: number
   berthType: string
   purposeTypeId: number
   purposeId: number
   cargoTypeId: number
   passengers: number
   estimatedArrival: string
   estimatedDeparture: string
   note: string
   sequence: number
}
