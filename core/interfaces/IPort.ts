export interface IPortGet {
   country_id: number;
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
   locode: string;
}

export interface IPortAdd {
   country_id: number;
   name: string;
   locode: string;
}

export interface IPortUpdate {
   country_id: number;
   name: string;
   status?: boolean;
   locode: string;
}
