<template>
   <div class="water-traffic-map grid grid-cols-1 md:grid-cols-2 gap-[18px] mt-8 mb-5">
      <div class="mip overflow-hidden rounded-3xl flex flex-col">
         <h1 class="bg-primaryy-500 font-anuphan-semi-bold text-center text-grayy-25 py-3 px-6">
            MAPTAPHUT INDUSTRIAL PORT
         </h1>
         <div id="map"></div>
      </div>
      <div class="anchor-zone overflow-hidden rounded-3xl flex flex-col">
         <h1 class="bg-primaryy-500 font-anuphan-semi-bold text-center text-grayy-25 py-3 px-6">
            ANCHOR ZONE
         </h1>
         <div id="map2"></div>
      </div>
   </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import berthData from "./mockAISData/berths.json";
import useAisService from "~/core/services/aisService";

const aisService = useAisService();
const map = ref<any>(null);
const map2 = ref<any>(null);
let portLimitPolygon: any = null;
const currentZoom = ref<number>(0);
const currentZoom2 = ref<number>(0);

onMounted(() => {
   initMap();
   getAisMap();

   setInterval(() => {
      getAisMap();
   }, 300000);
});

const initMap = () => {
   map.value = L.map("map", {
      attributionControl: false,
   }).setView([12.65885, 101.15327], 12);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
         '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
   }).addTo(map.value);

   map2.value = L.map("map2", {
      attributionControl: false,
   }).setView([12.5849, 101.222], 13);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
         '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
   }).addTo(map2.value);

   // L.circle([12.5849, 101.222], {
   //    color: "#e6f2f5",
   //    fillColor: "#e6f2f5",
   //    fillOpacity: 0.8,
   //    radius: 1852,
   // }).addTo(map.value);
   L.circle([12.5849, 101.222], {
      color: "#e6f2f5",
      fillColor: "#e6f2f5",
      fillOpacity: 0.8,
      radius: 1852,
   }).addTo(map2.value);

   const portLimitCoords: [number, number][] = [
      [12.6799823, 101.0916602],
      [12.6799823, 101.2471561],
      [12.6028959, 101.2457875],
      [12.6028767, 101.0916602],
   ];

   portLimitPolygon = L.polygon(portLimitCoords, {
      color: "white",
      weight: 2,
      fillOpacity: 0,
   }).addTo(map.value);
};

const getShipDetails = (VesselTypeValue: string) => {
   const vesselType = parseInt(VesselTypeValue);
   let color = "#ffffff";
   let detail = "";

   if (vesselType === 0) {
      color = "#0FF";
      detail = "Not Available";
   } else if (vesselType >= 1 && vesselType <= 19) {
      color = "#FFF";
      detail = "Other";
   } else if (vesselType === 30) {
      color = "#BF8F00";
      detail = "Fishing";
   } else if ([21, 22, 52].includes(vesselType)) {
      color = "#FFC000";
      detail = "Tug Tow";
   } else if (vesselType === 35) {
      color = "#0052E8";
      detail = "Military";
   } else if (vesselType === 36 || vesselType === 37) {
      color = "#68FF00";
      detail = "Pleasure Craft/Sailing";
   } else if (vesselType >= 50 && vesselType <= 59 && ![52].includes(vesselType)) {
      color = "#ffffff";
      detail = "Service Vessels";
   } else if (vesselType >= 60 && vesselType <= 69) {
      color = "#51C700";
      detail = "Passenger";
   } else if (vesselType >= 70 && vesselType <= 79) {
      color = "#FF0";
      detail = "Cargo";
   } else if (vesselType >= 80 && vesselType <= 89) {
      color = "#F60";
      detail = "Tanker";
   } else if (vesselType >= 90 && vesselType <= 99) {
      color = "#FFF";
      detail = "Other";
   } else if (vesselType === 1001 || vesselType === 1002) {
      color = "#BF8F00";
      detail = "Fishing";
   } else if (vesselType === 1003 || vesselType === 1004) {
      color = "#ffffcc";
      detail = "Freight Barge and Freight Ship";
   } else if (vesselType >= 1005 && vesselType <= 1011) {
      color = "#FF0";
      detail = "Cargo";
   } else if ([1012, 1013, 1014, 1015].includes(vesselType)) {
      color = "#51C700";
      detail = "Passenger";
   } else if (vesselType === 1016) {
      color = "#ffffcc";
      detail = "Public Freight";
   } else if (vesselType === 1017) {
      color = "#F60";
      detail = "Tanker";
   } else if (vesselType === 1018) {
      color = "#FFF";
      detail = "Other";
   } else if (vesselType === 1019) {
      color = "#68FF00";
      detail = "Pleasure Craft/Sailing";
   } else if (vesselType === 1020) {
      color = "#ffffff";
      detail = "Research Vessel";
   } else if (vesselType === 1021) {
      color = "#0052E8";
      detail = "Military";
   } else if (vesselType === 1022) {
      color = "#ffffff";
      detail = "School Ship";
   } else if (vesselType === 1023) {
      color = "#FFC000";
      detail = "Tug Tow";
   } else if (vesselType === 1024) {
      color = "#F60";
      detail = "Tanker";
   } else if (vesselType === 1025) {
      color = "#FFC000";
      detail = "Tug Tow";
   } else {
      color = "#ffffff";
      detail = "-";
   }
   return { color, detail };
};

const getAisMap = async () => {
   const res = await aisService.getAisMap();
   if (res.statusCode === 200) {
      berthData.berthbox.forEach((berth) => {
         const polygon = L.polygon(
            [
               [berth.p1.lat, berth.p1.lon],
               [berth.p2.lat, berth.p2.lon],
               [berth.p4.lat, berth.p4.lon],
               [berth.p3.lat, berth.p3.lon],
            ],
            {
               color: "black",
               weight: 0,
               opacity: 1,
               fillColor: "yellow",
               fillOpacity: 0.1,
            }
         ).addTo(map.value);

         const polygon2 = L.polygon(
            [
               [berth.p1.lat, berth.p1.lon],
               [berth.p2.lat, berth.p2.lon],
               [berth.p4.lat, berth.p4.lon],
               [berth.p3.lat, berth.p3.lon],
            ],
            {
               color: "black",
               weight: 0,
               opacity: 1,
               fillColor: "yellow",
               fillOpacity: 0.1,
            }
         ).addTo(map2.value);

         polygon.bindPopup(
            `<div>
            <span class="font-anuphan-semi-bold">Berth Name:</span>
            <span>${berth.name || "-"}</span>
          </div>`
         );

         const tooltip = polygon
            .bindTooltip(berth.name, {
               permanent: true,
               direction: "right",
               className: "custom-tooltip",
            })
            .getTooltip();
         map.value.on("zoomend", () => {
            currentZoom.value = map.value.getZoom();
            const tooltipElement = tooltip?.getElement();
            if (tooltipElement) {
               tooltipElement.style.display = currentZoom.value <= 13 ? "none" : "block";
            }
         });

         const tooltip2 = polygon2
            .bindTooltip(berth.name, {
               permanent: true,
               direction: "right",
               className: "custom-tooltip",
            })
            .getTooltip();
         map2.value.on("zoomend", () => {
            currentZoom2.value = map2.value.getZoom();
            const tooltipElement = tooltip2?.getElement();
            if (tooltipElement) {
               tooltipElement.style.display = currentZoom2.value <= 13 ? "none" : "block";
            }
         });
      });

      res.data.forEach((ship: any) => {
         const shipDetail: any = getShipDetails(ship.VesselType);

         const popupContent = `
         <div class="custom-popup">
           <div>
             <span class="font-anuphan-semi-bold">NAME:</span>
             <span>${ship.Name || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">TYPE:</span>
             <span>${shipDetail.detail || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">MMSI:</span>
             <span>${ship.MMSI || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">IMO:</span>
             <span>${ship.IMO || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">CALL SIGN:</span>
             <span>${ship.CallSgn || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">SOG:</span>
             <span>${ship.SOG || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">DESTINATION:</span>
             <span>${ship.Destination || "-"}</span>
           </div>
           <div>
             <span class="font-anuphan-semi-bold">ETA:</span>
             <span>${ship.ETA || "-"}</span>
           </div>
         </div>
       `;

         const createShipPolygon = () => {
            const calculatePolygonSize = (width: number, length: number) => {
               const zoomLevel = map.value.getZoom();
               const scaleFactor = Math.pow(2, zoomLevel - 12);
               const baseWidth = width / 200000;
               const baseLength = length / 200000;
               return {
                  latOffset: baseLength / scaleFactor,
                  lonOffset: baseWidth / scaleFactor,
               };
            };

            const rotateCoordinates = (lat: number, lon: number, latOffset: number, lonOffset: number, angle: number) => {
               const radians = (Math.PI / 180) * angle;
               const sin = Math.sin(radians);
               const cos = Math.cos(radians);
               return {
                  rotatedLat: lat + latOffset * cos - lonOffset * sin,
                  rotatedLon: lon + latOffset * sin + lonOffset * cos,
               };
            };

            const { latOffset, lonOffset } = calculatePolygonSize(ship.Width || 50, ship.Length || 200);
            const COG = ship.COG || 0;

            const nose = rotateCoordinates(Number(ship.Lat), Number(ship.Lon), latOffset * 1.5, 0, COG);
            const sternLeft = rotateCoordinates(Number(ship.Lat), Number(ship.Lon), -latOffset * 1.2, -lonOffset * 0.8, COG);
            const sternRight = rotateCoordinates(Number(ship.Lat), Number(ship.Lon), -latOffset * 1.2, lonOffset * 0.8, COG);
            const middleLeft = rotateCoordinates(Number(ship.Lat), Number(ship.Lon), 0, -lonOffset, COG);
            const middleRight = rotateCoordinates(Number(ship.Lat), Number(ship.Lon), 0, lonOffset, COG);

            const shipCoordinates: L.LatLngExpression[] = [
               [nose.rotatedLat, nose.rotatedLon],
               [middleRight.rotatedLat, middleRight.rotatedLon],
               [sternRight.rotatedLat, sternRight.rotatedLon],
               [sternLeft.rotatedLat, sternLeft.rotatedLon],
               [middleLeft.rotatedLat, middleLeft.rotatedLon],
            ];

            const shipCenter = L.latLng(Number(ship.Lat), Number(ship.Lon));
            if (portLimitPolygon && portLimitPolygon.getBounds().contains(shipCenter)) {
               const shipPolygon = L.polygon(shipCoordinates, {
                  color: shipDetail.color,
                  weight: 1,
                  fillColor: shipDetail.color,
                  fillOpacity: 0.8,
               }).addTo(map.value);
               shipPolygon.bindPopup(popupContent);
            }
            const shipPolygon2 = L.polygon(shipCoordinates, {
               color: shipDetail.color,
               weight: 1,
               fillColor: shipDetail.color,
               fillOpacity: 0.8,
            }).addTo(map2.value);
            shipPolygon2.bindPopup(popupContent);
         };
         createShipPolygon();
      });
   }
};
</script>

<style lang="scss">
#map,
#map2 {
   height: 300px;
   width: 100%;
   border-radius: 12px;
   flex-grow: 1;
   @media (min-width: 1024px) {
      height: 20vw; 
   }
}

.leaflet-popup-content-wrapper {
   border-radius: 8px;
   border: 1px solid #b7a4ce;
   background: #eeebf2;
   box-shadow: 0px 4px 20px 0px rgba(111, 74, 158, 0.17);
}

.leaflet-popup-content {
   margin: 8px;
}

.leaflet-tooltip {
   display: none;
}
</style>