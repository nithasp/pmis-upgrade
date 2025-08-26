import type { IUploadFile } from "./IUploadFile";

export interface IVesselGovermentGet {
   id: number;
   name: string;
   vesselFlagName: string;
   officialNumber: string;
   loa: number;
   breadth: number;
   draft: number;
   displaceent: number;
   uploadFiles: IUploadFile[];
}
export interface IVesselGovermentDetail {
   id: number;
   name: string;
   vesselFlagName: string;
   officialNumber: string;
   authorityId:number;
   authorityName:string;
   loa: number;
   breadth: number;
   draft: number;
   displaceent: number;
   uploadFiles: IUploadFile[];
}
