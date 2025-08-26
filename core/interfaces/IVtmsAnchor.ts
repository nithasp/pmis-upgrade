import { date } from "zod";

export interface IVtmsAnchorGet {
   id: number;
   status: string;
   berth_id: number;
   berth_name: string;
   vessel_flag: string;
   vessel_name: string;
   vessel_imo_number: string;
   vessel_official_number: string;
   vessel_type_id: number;
   vessel_type_name: string;
   pilot_date: string;
   anchor_date: string;
   aweigh_date: string;
   latitude: string;
   longitude: string;
   remark: string;
   duration: string;
}

export interface IVtmsAnchorDetail {
   id: number;
   status: string;
   voyage: string;
   gross_tonnage: number;
   depth: number;
   pilot_date: string;
   anchor_date: string;
   aweigh_date: string;
   latitude: string;
   longitude: string;
   remark: string;
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
}
export interface IVtmsLogBookAdd {
   document_id: number;
   vessel_id: number;
   gross_tonnage: number;
   depth: number;
   port_id_next: number;
   port_id_last: number;
   voyage: string;
   anchors: [
      {
         berth_id: number;
         pilot_date: string;
         anchor_date: string;
         aweigh_date: string;
         latitude: string;
         longitude: string;
         remark: string;
      }
   ];
}
