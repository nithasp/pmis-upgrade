import type { IFilter } from "./IFilter"

export interface IFilterLogbook extends IFilter {
   log_type: string
   berth_id: number
   mooring_date: string
   departure_date: string
   vesselId: number
   purpose_type_ids?: any
   berth_ids?: any
   mooringDateBegin: string
   mooringDateEnd: string
   unmooringDateBegin: string
   unmooringDateEnd: string
}
