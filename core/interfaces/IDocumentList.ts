export interface IDocumentList {
   id: number
   createAt: string
   status: string
   statusDes: string
   docNumber: string
   vesselName: string
   imoNumber: string
   officialNumber: string
   grt: number
   eta: string
   berthNames: string
   vesselStatus: string
   vesselStatusDes: string
   portAt: string | null
   portDues: number
   vesselFlagId: number
   vesselFlagName: string
   vesselFlagImage: string
   vesselTypeId: number
   vesselTypeName: string
   callSign: string
   agencyName: string
   isNewShip: boolean
}
