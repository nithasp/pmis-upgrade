import type { IUploadFile } from "./IUploadFile";

export interface IContractAnnualRate {
   id: number | null;
   start: string;
   end: string;
   rate: number;
}

export interface IContractDetail {
   id: number;
   contractNo: string;
   berthId: number;
   berthName: string;
   start: string;
   end: string;
   initialRate: number;
   annualIncreaseRate: number;
   rateChangeCycle: number;
   rateChangeStartYear: string;
   annualRates: IContractAnnualRate[];
   uploadFiles: IUploadFile[]
   terminatedDate: string | null;
}

export interface IContractPayload extends Omit<IContractDetail, 'id'> { }

export interface IContractFilter {
   limit: number;
   page: number;
   contractNumber: string;
   berthId: number;
   Order: {
      column: string
      dir: string
   }[];
}