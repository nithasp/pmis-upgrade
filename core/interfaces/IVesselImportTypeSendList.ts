export interface IVesselImportTypeSendList {
   id: number;
   status: string;
   statusDes: string;
   documentNumber: string;
   vesselName: string;
   imoNumber: string;
   officialNumber: string;
   vesselFlagImage: string;
   isMap: boolean;
   grtVS: number;
   grtVT: number;
   berthId: number;
   berthName: string;
   jettyId: number;
   jettyName: string;
   mooringDateVS: string;
   unmooringDateVS: string;
   mooringDateVT: string;
   unmooringDateVT: string;
   note: string;
   products: Product[];
   vesselId: number;
}

interface Product {
   id: number;
   purposeTypeId: number;
   purposeTypeName: string;
   productId: number;
   productName: string;
   mTonQty: number;
   rTonQty: number;
}
