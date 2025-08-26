export interface IAisVessel {
   vesselFlagId: number;
   vesselFlagName: string;
   vesselFlagImage: string;
   vesselTypeId: number | null;
   vesselTypeName: string;
   id: number;
   owner: string;
   ownerId: number | null;
   name: string;
   imoNumber: string;
   mmsiNumber: string;
   dsvNumber: string;
   officialNumber: string;
   callSign: string;
   loadWeight: number;
   grossTonnage: number;
   netTonnage: number;
   lengthOverall: number;
   breadthExtreme: number;
   depth: number;
   mainEngine: string;
   bandAndModel: string;
   licenseExpiredDate: string | null;
   createdName: string;
   updatedName: string;
   uploadFiles: any | null;
}

export interface IAisActivityList {
   id: number;
   activityDate: string;
   vessel: IAisVessel;
   mmsi: string;
   location: string;
   latitude: string;
   longitude: string;
}
