import type { IBerthsDocumentRequest } from "./IBerthsDocumentRequest";
import type { IProductDocumentData } from "./IProductDocumentData";
import type { IUploadFile } from "./IUploadFile";

export interface IBerthDocumentList extends IBerthsDocumentRequest {
   id: number
   products: IProductDocumentData[]
   files: IUploadFile[] 
}
