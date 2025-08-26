export interface ILocateGet {
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
}

export interface ILocateAdd {
   name: string;
}

export interface ILocateUpdate {
   name: string;
   status?: boolean;
}
