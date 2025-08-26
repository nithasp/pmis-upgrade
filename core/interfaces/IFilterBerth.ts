export interface IFilterBerth {
   limit: number;
   page: number;
   search: string;
   vessel_type_id: string;
   personType?: string;
   Order?: {
      column: string
      dir: string
   }[];
}