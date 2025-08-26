import type { IFilter } from "./IFilter"

export interface IFilterDocument extends IFilter {
   status: any
   berthId: number
   begin: string
   end: string,
   etaBegin: string
   etaEnd: string,
   vesselStatus: string
   vesselFlagId: number
   purposeId: number
}
