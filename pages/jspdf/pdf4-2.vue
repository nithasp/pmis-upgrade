<template>
   <button @click="generatePDF">Generate PDF pdf4-2</button>
</template>

<script setup lang="ts">
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./THSarabunNew-normal";
import "./THSarabunNew Bold-normal";
import logoVertical from "~/assets/images/logo-th-vertical.png";

const props = defineProps({
   pdfData: {
      type: Array,
      default: [],
   },
   joinedThaiDateString: {
      type: String,
      default: "",
   },
});

const shipDataPdf4_2Model = [
   {
      userId: 49,
      contactName: "วิชัยมาศ สานสิริ",
      vesselId: 1,
      vesselName: "kanompang",
      grossTonnage: 100000,
      fee: 800000,
      vat: 5600000,
      total: 856000,
   },
   {
      userId: 49,
      contactName: "วิชัยมาศ สานสิริ",
      vesselId: 2,
      vesselName: "saiyok",
      grossTonnage: 50000,
      fee: 400000,
      vat: 2800000,
      total: 456000,
   },
   {
      userId: 49,
      contactName: "วิชัยมาศ สานสิริ",
      vesselId: 3,
      vesselName: "chaophraya",
      grossTonnage: 150000,
      fee: 900000,
      vat: 6300000,
      total: 990000,
   },
   {
      userId: 50,
      contactName: "อนุชา พิทักษ์ไทย",
      vesselId: 4,
      vesselName: "maeklong",
      grossTonnage: 75000,
      fee: 600000,
      vat: 4200000,
      total: 720000,
   },
   {
      userId: 51,
      contactName: "สุนารี ศรีทอง",
      vesselId: 5,
      vesselName: "tapao",
      grossTonnage: 120000,
      fee: 700000,
      vat: 4900000,
      total: 770000,
   },
   {
      userId: 52,
      contactName: "สมพงษ์ โพธิ์ทอง",
      vesselId: 6,
      vesselName: "bangpakong",
      grossTonnage: 95000,
      fee: 550000,
      vat: 3850000,
      total: 640000,
   },
];

function prepareGroupedTableData(shipData:any) {
   const grouped:any = {};
   const result = [];

   shipData.forEach((item:any) => {
      if (!grouped[item.userId]) {
         grouped[item.userId] = {
            userId: item.userId,
            contactName: item.contactName,
            vessels: [],
            totalGrossTonnage: 0,
            totalFee: 0,
            totalVat: 0,
            total: 0,
         };
      }

      grouped[item.userId].vessels.push(item);
      grouped[item.userId].totalGrossTonnage += item.grossTonnage;
      grouped[item.userId].totalFee += item.fee;
      grouped[item.userId].totalVat += item.vat;
      grouped[item.userId].total += item.total;
   });

   let groupIndex = 1;
   for (const userId in grouped) {
      const group = grouped[userId];
      const vessels = group.vessels;

      vessels.forEach((vessel:any, index:any) => {
         if (index === 0) {
            result.push([
               { rowSpan: vessels.length + 1, content: String(groupIndex), styles: { halign: "center" } },
               { rowSpan: vessels.length + 1, content: group.contactName },
               vessel.vesselName,
               vessel.grossTonnage.toLocaleString(),
               vessel.fee.toLocaleString(),
               vessel.vat.toLocaleString(),
               vessel.total.toLocaleString(),
            ]);
         } else {
            result.push([
               vessel.vesselName,
               vessel.grossTonnage.toLocaleString(),
               vessel.fee.toLocaleString(),
               vessel.vat.toLocaleString(),
               vessel.total.toLocaleString(),
            ]);
         }
      });

      result.push([
         { content: "รวม", styles: { halign: "left", colSpan: 2 } },
         group.totalGrossTonnage.toLocaleString(),
         group.totalFee.toLocaleString(),
         group.totalVat.toLocaleString(),
         group.total.toLocaleString(),
      ]);

      groupIndex++;
   }

   return result;
}

function generatePDF() {
   const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A3",
   });

   const pageWidth = doc.internal.pageSize.getWidth();
   const logoWidth = 150;
   const logoHeight = 150;
   const logoX = (pageWidth - logoWidth) / 2;
   doc.addImage(logoVertical, 'PNG', logoX, -10, logoWidth, logoHeight);

   doc.setFont("THSarabunNew Bold", "normal");
   doc.setFontSize(20);

   const textStartY = -10 + logoHeight;
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", pageWidth / 2, textStartY, { align: "center" });
   doc.text("รายงานตัวแทนเรือไทยที่เรียงตาม PORT DUES จากมากไปน้อย", pageWidth / 2, textStartY + 21, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 40, { align: "center" });

   const tableStartY = textStartY + 50 + 10;

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ตัวแทนเรือ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "เจ้าของเรือ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ปริมาณสินค้าผ่านท่า", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ค่าสินค้าผ่านท่า", colSpan: 3, styles: { valign: "middle", halign: "center" } },
         ],
         [
            { content: "ไม่รวม VAT", styles: { halign: "center" } },
            { content: "VAT", styles: { halign: "center" } },
            { content: "รวม VAT", styles: { halign: "center" } },
         ],
      ],
      body: prepareGroupedTableData(props.pdfData),
      styles: {
         font: "THSarabunNew",
         fontSize: 16,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontSize: 16,
         fontStyle: "normal",
         halign: "center",
         valign: "middle",
         textColor: "#000000",
         fillColor: "#92D050",
         lineColor: "",
         lineWidth: 0.1,
      },
      bodyStyles: {
         valign: "middle",
         lineWidth: 0.1,
         lineColor: [0, 0, 0],
      },
      columnStyles: {
         0: { halign: "center" },
         1: { halign: "center" },
         2: { halign: "left" },
         3: { halign: "right" },
         4: { halign: "right" },
         5: { halign: "right" },
         6: { halign: "right" },
      },
      theme: "grid",
   });
   doc.save(`report4-2_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>
