export interface ICargoTypeGet {
    created_at: string;
    created_by: string;
    id: number;
    name: string;
    status: boolean;
    updated_at: string;
    updated_by: string;
 }
 
 export interface ICargoTypeAdd {
    name: string;
 }
 
 export interface ICargoTypeUpdate {
    name: string;
    status?: boolean;
 }
 