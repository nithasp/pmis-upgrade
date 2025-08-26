<template>
   <button @click="generatePDF">Generate PDF pdf4-3</button>
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

const shipDataPdf4_3Model: any = [
   {
      userId: 49,
      fullName: "วิชัยมาศ สานสิริ",
      owner: "Perna house",
      mTon: 1.23,
      initialRate: 500,
      portCharges: 615,
      portChargesVat: 43.05,
      "portChargesNet ": 658.05,
   },
   {
      userId: 49,
      fullName: "วิชัยมาศ สานสิริ",
      owner: "Ocean Fleet",
      mTon: 2.5,
      initialRate: 600,
      portCharges: 700,
      portChargesVat: 49.0,
      "portChargesNet ": 749.0,
   },
   {
      userId: 52,
      fullName: "สมชาย ทะเลทอง",
      owner: "Sea Star",
      mTon: 3.75,
      initialRate: 550,
      portCharges: 680,
      portChargesVat: 47.6,
      "portChargesNet ": 727.6,
   },
   {
      userId: 61,
      fullName: "ณัฐวุฒิ แสงทอง",
      owner: "Blue Harbor",
      mTon: 1.8,
      initialRate: 520,
      portCharges: 630,
      portChargesVat: 44.1,
      "portChargesNet ": 674.1,
   },
   {
      userId: 49,
      fullName: "วิชัยมาศ สานสิริ",
      owner: "Sun Marine",
      mTon: 4.1,
      initialRate: 580,
      portCharges: 715,
      portChargesVat: 50.05,
      "portChargesNet ": 765.05,
   },
];

function prepareGroupedTableData(shipData: any) {
   const grouped: any = {};
   const result = [];

   let grandTotalGrossTonnage = 0;
   let grandTotalFee = 0;
   let grandTotalVat = 0;
   let grandTotalAll = 0;

   shipData.forEach((item: any) => {
      if (!grouped[item.userId]) {
         grouped[item.userId] = {
            userId: item.userId,
            fullName: item.fullName,
            vessels: [],
            totalGrossTonnage: 0,
            totalFee: 0,
            totalVat: 0,
            total: 0,
         };
      }

      grouped[item.userId].vessels.push(item);
      grouped[item.userId].totalGrossTonnage += item.mTon;
      grouped[item.userId].totalFee += item.portCharges;
      grouped[item.userId].totalVat += item.portChargesVat;
      grouped[item.userId].total += item.portCharges + item.portChargesVat;

      grandTotalGrossTonnage += item.mTon;
      grandTotalFee += item.portCharges;
      grandTotalVat += item.portChargesVat;
      grandTotalAll += item.portCharges + item.portChargesVat;
   });

   let groupIndex = 1;
   for (const userId in grouped) {
      const group = grouped[userId];
      const vessels = group.vessels;

      vessels.forEach((vessel: any, index: any) => {
         const row = [];
         if (index === 0) {
            row.push(
               { rowSpan: vessels.length + 1, content: String(groupIndex), styles: { halign: "center" } },
               { rowSpan: vessels.length + 1, content: group.fullName, styles: { halign: "center" } },
               vessel.owner,
               vessel.mTon.toLocaleString(),
               vessel.portCharges.toLocaleString(),
               vessel.portChargesVat.toLocaleString(),
               (vessel.portCharges + vessel.portChargesVat).toLocaleString()
            );
         } else {
            row.push(
               vessel.owner,
               vessel.mTon.toLocaleString(),
               vessel.portCharges.toLocaleString(),
               vessel.portChargesVat.toLocaleString(),
               (vessel.portCharges + vessel.portChargesVat).toLocaleString()
            );
         }
         result.push(row);
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

   result.push([
      { content: "รวมทั้งหมด", colSpan: 3, styles: { halign: "center", font: "THSarabunNew Bold" } },
      { content: grandTotalGrossTonnage.toLocaleString(), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: grandTotalFee.toLocaleString(), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: grandTotalVat.toLocaleString(), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: grandTotalAll.toLocaleString(), styles: { halign: "right", font: "THSarabunNew Bold" } },
   ]);

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
   doc.text("รายงานตัวแทนเรือไทยที่เรียงตามค่าสินค้าผ่านท่าจากมากไปน้อย", pageWidth / 2, textStartY + 21, { align: "center" });
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
   doc.save(`report4-3_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>
