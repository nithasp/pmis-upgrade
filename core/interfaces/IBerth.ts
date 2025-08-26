export interface IBerthGet {
   id: number | string;
   name?: string;
   name_th: string;
   name_en: string;
   name_alt: string;
   vessel_type_id?: number;
   vessel_type: IVesselType;
   jettys: IJetty[];
   status: boolean;
   created_at: string;
   created_by: string;
   updated_at: string;
   updated_by: string;
   berth_type?: string;
}

export interface IBerthAdd {
   jettys: IJetty[];
   name_alt: string;
   name_en: string;
   name_th: string;
   vessel_type_id?: number;
   berth_type: string;
}

export interface IBerthUpdate {
   status?: boolean;
   jettys: IJetty[];
   name_alt: string;
   name_en: string;
   name_th: string;
   vessel_type_id?: number;
   berth_type: string;
}

export interface IJetty {
   id?: number;
   name: string;
   isRequired?: boolean;
}

export interface IVesselType {
   id: number;
   name: string;
}
