export interface IFilter {
   page: number
   limit: number
   search: String
   Order?: {
      column: string
      dir: string
   }[]
}
