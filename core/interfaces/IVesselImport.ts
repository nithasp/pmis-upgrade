export interface IVesselImportList {
   id: number;
   status: string;
   statusDes: string;
   vesselName: string;
   imoNumber: string;
   officialNumber: string;
   vesselFlagId: number;
   vesselFlagName: string;
   vesselFlagImage: string;
   vesselTypeId: number;
   vesselTypeName: string;
   grt: number;
   mooringDate: string;
   unmooringDate: string;
   berthId: number;
   berthName: string;
   jettyId: number;
   jettyName: string;
   note: string;
}

export interface IVesselImportError {
   rowNo: number;
   vesselName: string;
   note: string;
}

interface VesselFlag {
   id: number;
   name: string;
   image_path: string;
}

interface Vessel {
   id: number;
   owner: string;
   vessel_flag: VesselFlag;
   name: string;
   vessel_type: string;
   imo_number: string;
   mmsi_number: string;
   official_number: string;
   call_sign: string;
   license_expired_date: string | null;
   load_weight: number;
   gross_tonnage: number;
   net_tonnage: number;
   length_overall: number;
   breadth_extreme: number;
   depth: number;
   main_engine: string;
   band_and_model: string;
}

interface LogBookDetails {
   berth_id: number;
   berth_name: string;
   purpose_id: number;
   purpose_name: string;
   cargo_type_id: number;
   cargo_type_name: string;
   cargo_wharfage_id: number;
   cargo_wharfage_name: string;
   jetty_id: number;
   jetty_name: string;
   mooring_date: string | null;
   departure_date: string | null;
}

interface LogBook {
   id: number;
   status: string;
   voyage: string;
   gross_tonnage: number;
   depth: number;
   port_id_next: number;
   port_name_next: string;
   port_id_last: number;
   port_name_last: string;
   document_berth_id: number | null;
   document_number: string;
   vessel: Vessel;
   details: LogBookDetails;
   create_date: string | null;
   tugs: any;
   pilots: any;
   products: any;
   agency_name: string;
}
export interface IVesselImportEdit {
   id: number;
   vesselName: string;
   imoNumber: string;
   officialNumber: string;
   vesselFlagId: number;
   vesselFlagName: string;
   vesselFlagImage: string;
   vesselTypeId: number;
   vesselTypeName: string;
   grossTonnage: number;
   mooringDate: string | null;
   unmooringDate: string | null;
   berthId: number;
   berthName: string;
   jettyId: number;
   jettyName: string;
   note: string;
   notes: string[];
   status: string;
   statusDes: string;
   files: any[];
   products: any[];
   logBook: LogBook;

   statementFile: any;
   shipFile: any,
   cargoManifestFile: any,
   surveyorFile: any,
   certificateQuantityFile: any,
   berthBookingRequestFile: any,
   otherFile: any,
   [key: string]: any;
}
interface DateValidationField {
   message: string;
   pristine: boolean;
}

export type DateValidationIVesselImportEdit = Record<string, DateValidationField>;
