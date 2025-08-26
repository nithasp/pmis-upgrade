import type { IUploadFile } from "./IUploadFile"

export interface IVesselRequest {
   name: string
   callSign: string
   imoNumber: string
   owner: string
   ownerId: number | null
   breadthExtreme: number
   depth: number
   grossTonnage: number
   lengthOverall: number
   loadWeight: number
   mainEngine: string
   bandAndModel: string
   mmsiNumber: string
   netTonnage: number
   officialNumber: string
   vesselFlagId: number
   vesselTypeId: number
   uploadFiles: IUploadFile[]
   vesselLicenseExpiredDate?: string | null
}
