export interface IFilterVesselInOutList {
   limit: number;
   page: number;
   search: string;
   status: string;
   created: string;
   mooringDate: string;
   unmooringDate: string;
   vesselFlagId: number;
   vesselTypeId: number;
   berthId: number;
   jettyId: number;
   productName: string;
   purposeTypeId: number;
   mooringDateVSBegin: string;
   mooringDateVSEnd: string;
   unmooringDateVSBegin: string;
   unmooringDateVSEnd: string;
   mooringDateVTBegin: string;
   mooringDateVTEnd: string;
   unmooringDateVTBegin: string;
   unmooringDateVTEnd: string;
 }