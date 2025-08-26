import { date } from "zod";

export interface IVtmsLogBookGet {
   id: number;
   status: string;
   create_date: string;
   berth_id: number;
   berth_name: string;
   jetty_id: number;
   jetty_name: string;
   document_berth_id: number;
   document_number: string;
   vessel_flag: string;
   vessel_name: string;
   vessel_imo_number: string;
   vessel_official_number: string;
   vessel_type_id: number;
   vessel_type_name: string;
   voyage: string;
   gross_tonnage: number;
   depth: number;
   purpose_id: number;
   purpose_name: string;
   agency_name: string;
}

export interface IVtmsLogBookDetail {
   data: {
      id: number;
      status: string;
      voyage: string;
      gross_tonnage: number;
      depth: number;
      port_id_next: number;
      port_name_next: string;
      port_id_last: number;
      port_name_last: string;
      document_berth_id: number;
      document_number: string;
      vessel: {
         id: number;
         owner: string;
         vessel_flag: {
            id: number;
            name: string;
            image_path: string;
         };
         name: string;
         vessel_type: string;
         imo_number: string;
         mmsi_number: string;
         official_number: string;
         call_sign: string;
         license_expired_date: string;
         load_weight: number;
         gross_tonnage: number;
         net_tonnage: number;
         length_overall: number;
         breadth_extreme: number;
         depth: number;
         main_engine: string;
         band_and_model: string;
      };
      details: {
         berth_id: number;
         berth_name: string;
         purpose_id: number;
         purpose_name: string;
         locate_id: number;
         locate_name: string;
         use_berth_id: number;
         cargo_type_id: number,
         cargo_type_name:string,
         cargo_wharfage_id: number,
         cargo_wharfage_name:string,
         jetty_id: number;
         jetty_name: string;
         mooring_date: string;
         departure_date: string;
      };
      create_date: string;
      tugs: [];
      pilots: [];
      products: [];
      agency_name: string;
   };
}
export interface IVtmsLogBookAdd {
   vesselType: string,
   document_berth_id: number;
   vessel_id: number;
   gross_tonnage: number;
   depth: number;
   port_id_next: number;
   port_id_last: number;
   voyage: string;
   details: [
    //   {
    //      type_doc: string;
    //      berth_id: number;
    //      purpose_id: number;
    //      locate_id: number;
    //      use_berth_id: number;
    //      jetty_id: number;
    //      mooring_date: any;
    //      departure_date: any;
    //   }
   ];
   tugs: [];
   pilots: [];
   products: [];
}
