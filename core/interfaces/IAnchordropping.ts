export interface IFormGroupValid {
   mooring_date: string | Date;
   departure_date: string | Date;
   aweigh_date: string | Date;
   anchor_date: string | Date;
   remark?: string;
   [key: string]: any;
}

interface DateValidationField {
    message: string;
    pristine: boolean;
  }
  
export type DateValidationAnchorDroppingForm = Record<string, DateValidationField>;