export interface IDocumentBerthMit {
   id: number;
   createAt: string;
   status: string;
   statusDes: string;
   docNumber: string;
   vesselName: string;
   imoNumber: string;
   officialNumber: string;
   grt: number;
   eta: string;
   etd: string;
   loa: string;
   cargoWorkTime: string;
   berthNames: string;
   berthSaveDate: string;
   jettyName: string;
   jettyId: number;
   vesselStatus: string;
   vesselStatusDes: string;
   portAt: any;
   portDues: number;
   vesselFlagId: number;
   vesselFlagName: string;
   vesselFlagImage: string;
   vesselTypeId: any;
   vesselTypeName: string;
   callSign: string;
   agencyName: string;
   approveDate: string;
}
export interface IDocumentVesselInMit {
   [key: string]: any;
}
export interface IFormMit {
   etd: Date | null;
}
export interface IFormMitWaiting {
   jettyId: number;
   etb: Date | null;
   etd: Date | null;
}

export interface IDocumentBerthTct extends IDocumentBerthMit {}

export interface IDocumentVesselInTct extends IDocumentVesselInMit {}