import type { IInvoiceDocumentRequest } from "./IInvoiceDocumentRequest"
import type { IVesselDocument } from "./IVesselDocument"

export interface IInvoiceDocument extends IInvoiceDocumentRequest {
   id: number,
   paymentMethodName: string
   paymentTermName: string
}
