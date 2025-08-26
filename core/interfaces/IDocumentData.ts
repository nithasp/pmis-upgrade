import type { IBerthDocumentList } from "./IBerthDocumentList"
import type { IFileUpload } from "./IFileUpload"
import type { IInvoiceDocument } from "./IInvoiceDocument"
import type { IRejectNote } from "./IRejectNote"
import type { ISpacialBerths } from "./ISpacialBerths"
import type { IVesselDocument } from "./IVesselDocument"

export interface IDocumentData {
   id: number
   requestDate: string
   docNumber: string;
   estimatedArrival: string;
   estimatedDeparture: string
   status: string
   statusDescription: string
   vesselStatus: string
   vesselStatusDes: string
   rejectedNote: IRejectNote[]
   vessel: IVesselDocument
   invoice: IInvoiceDocument
   berths: IBerthDocumentList[]
   spacialBerths?: ISpacialBerths[]
   vesselDocuments: IFileUpload[]
   canApprove: boolean
   isNewShip: boolean
}
