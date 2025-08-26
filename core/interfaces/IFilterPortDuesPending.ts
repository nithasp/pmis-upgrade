import type { IFilter } from "./IFilter"

export interface IFilterPortDuesPending extends IFilter {
   customerName: string
   berthId: number
   begin: string
   end: string
   Order?: {
      column: string
      dir: string
   }[]
}
