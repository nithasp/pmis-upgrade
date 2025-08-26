export interface IVesselTypePost {
   name: string;
}
export interface IVesselTypePut {
   activated: boolean;
   name: string;
   id?: number;
   status?:boolean;
}
export interface IVesselFlagPost {
   name: string;
   file_id: number;
}
export interface IVesselFlagPut {
   name: string;
   file_id: number;
}
export interface IVesselPurposePost {
   name: string;
}
export interface IVesselPurposePut {
   name: string;
   activated: boolean;
}
export interface IVesselPortPost {
   name: string;
   country_id: number;
}
export interface IVesselPortPut {
   activated: boolean;
   name: string;
   country_id: number;
}
export interface IVesselLocatePost {
   name: string;
}
export interface IVesselLocatePut {
   name: string;
   activated: boolean;
}
export interface IVesselBerthPost {
   name: string;
}
export interface IVesselBerthPut {
   name: string;
   activated: boolean;
}
export interface IVesselTypeList {
   id: number;
   name: string;
   status: boolean;
   created_at: string;
   created_by: string;
   updated_at: string;
   updated_by: string;
}
