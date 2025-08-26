import type { IFileUpload } from "./IFileUpload";
import type { IUploadFile } from "./IUploadFile"

export interface IVesselDocumentRequest {
   documentVesselId: number;
   vesselFlagId: number
   vesselTypeId: number
   vesselId: number
   vesselOwner: string
   vesselName: string
   vesselImoNumber: string
   vesselMMSiNumber: string
   vesselOfficialNumber: string
   vesselCallSign: string
   vesselNationality: string
   vesselCountry: string
   vesselLoadWeight: number
   vesselGrossTonnage: number
   vesselNetTonnage: number
   vesselLengthOverall: number
   vesselBreadthExtreme: number
   vesselDepth: number
   vesselMainEngine: string
   vesselBandAndModel: string
   vesselLicenseExpiredDate?: string | null
   vesselUploadFiles: IFileUpload[]
}
