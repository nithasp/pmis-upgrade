export interface IUseBerthGet {
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
}

export interface IUseBerthAdd {
   name: string;
}

export interface IUseBerthUpdate {
   name: string;
   status?: boolean;
}
