export interface IProductGet {
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   product_type_id: number;
   product_type_name: string;
   product_group_id: number;
   product_group_name: string;
   status: true;
   updated_at: string;
   updated_by: string;
}
export interface IProductDetail {
   created_at: string;
   created_by: string;
   id: number;
   name: string;
   product_type_id: number;
   product_type_name: string;
   product_group_id: number;
   product_group_name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
}
export interface IProductAdd {
   // status?: boolean | undefined;
   name: string;
   product_type_id: number;
   product_group_id?: number;
}

export interface IProductUpdate {
   status?: boolean | undefined;
   name: string;
   product_type_id: number;
   product_group_id?: number;
}
export interface IProductGroupGet {
   id: number;
   name: string;
}
export interface IProductTypeGet {
   created_at: string;
   created_by: string;
   product_type_id: number;
   product_type_name: string;
   product_group_id: number;
   product_group_name: string;
   status: boolean;
   updated_at: string;
   updated_by: string;
}

export interface IProductTypeAdd {
   product_group_id?: number;
   product_type_name: string;
   product_group_name: string;
}
export interface IProductTypeUpdate {
   product_type_name: string;
   product_group_id: number;
   product_group_name: string;
   status: boolean;
}
