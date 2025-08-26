import type { IFilter } from "./IFilter"

export interface IFilterVesselAgent extends IFilter {
   status: string
   personType: string
   begin: string
   end: string
   Order: {
      column: string
      dir: string
   }[]
}
