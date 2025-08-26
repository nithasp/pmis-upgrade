import type { IFilter } from "./IFilter"

export interface IFilterVessel extends IFilter {
   flag: number
   owner: string
   type: number,
   showAll: boolean,
   Order: {
      column: string
      dir: string
   }[]
}
