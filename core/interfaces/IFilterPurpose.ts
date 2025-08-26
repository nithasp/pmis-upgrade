export interface IFilterPurpose {
   limit: number;
   page: number;
   search: string;
   status: string;
   Order?: {
      column: string;
      dir: string;
   }[];
}
