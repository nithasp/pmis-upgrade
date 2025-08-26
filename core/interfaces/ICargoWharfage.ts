export interface ICargoWharfageGet {
    created_at: string;
    created_by: string;
    id: number;
    name: string;
    status: boolean;
    updated_at: string;
    updated_by: string;
 }
 
 export interface ICargoWharfageAdd {
    name: string;
 }
 
 export interface ICargoWharfageUpdate {
    name: string;
    status?: boolean;
 }
 