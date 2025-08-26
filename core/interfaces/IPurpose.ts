export interface IPurposeGet {
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
   sub_purpose_id: number;
   purpose_type_id: number;
   purpose_type_name: string;
   purpose_id: number;
   purpose_name: string;
}

export interface IPurposeAdd {
   name?: string;
   purpose_name: string;
   purpose_id?: number;
   purpose_type_name: string;
   purpose_type_id: number;
   status: boolean;
}

export interface IPurposeUpdate extends IPurposeAdd {}
