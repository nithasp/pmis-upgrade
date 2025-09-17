export interface DialogConfirmProps {
   title: string;
   desc: string;
   type: string;
   icon: string;
   colorConfirm: string;
}

export interface DialogAlertProps {
   title: string;
   desc: string;
   type: string;
}

export interface FieldValidation {
   message: string;
   pristine: boolean;
}

export interface ValidationFields {
   berthId: FieldValidation;
   contractNo: FieldValidation;
   start: FieldValidation;
   end: FieldValidation;
   initialRate: FieldValidation;
   annualIncreaseRate: FieldValidation;
   rateChangeCycle: FieldValidation;
   rateChangeStartYear: FieldValidation;
   terminatedDate: FieldValidation;
}

export interface YearOption {
   name: string;
   id: number;
}

export interface RateFilter {
   start: string;
   end: string;
   initialRate: number;
   annualIncreaseRate: number;
   rateChangeCycle: number;
   rateChangeStartYear: string;
}