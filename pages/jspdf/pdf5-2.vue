<template>
   <button @click="generatePDF">Generate PDF pdf5-2</button>
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

const shipDataPdf5_2Model = [
   {
      userId: 16,
      contactName: "esportTwoZero gameon",
      vesselId: 8,
      vesselName: "Ocean Star",
      grossTonnage: 20000,
      fee: 160000,
      vat: 1120000,
      total: 171200,
   },
];

function prepareGroupedTableData(shipData: any) {
   const formatNumber = (num: any) =>
      num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
   const tableRows = shipData.map((item: any, index: any) => [
      index + 1, // ลำดับ
      item.vesselName, // ตัวแทนเรือ
      formatNumber(item.grossTonnage), // GRT with formatting
      formatNumber(item.fee), // ไม่รวม VAT with formatting
      formatNumber(item.vat), // VAT with formatting
      formatNumber(item.total), // รวม VAT with formatting
   ]);

   const totalGrossTonnage = shipData.reduce((sum: any, item: any) => sum + item.grossTonnage, 0);
   const totalFee = shipData.reduce((sum: any, item: any) => sum + item.fee, 0);
   const totalVat = shipData.reduce((sum: any, item: any) => sum + item.vat, 0);
   const totalTotal = shipData.reduce((sum: any, item: any) => sum + item.total, 0);

   tableRows.push([
      { content: "รวมทั้งหมด", colSpan: 2, styles: { halign: "center", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalGrossTonnage), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalFee), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalVat), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalTotal), styles: { halign: "right", font: "THSarabunNew Bold" } },
   ]);

   return tableRows;
}

function generatePDF() {
   const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
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
   doc.text("รายงานผลการจัดซื้อจัดจ้างตามพระราชบัญญัติการจัดซื้อจัดจ้างฯ", pageWidth / 2, textStartY + 21, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 40, { align: "center" });

   const tableStartY = textStartY + 50 + 10;

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ตัวแทนเรือ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "GRT", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ค่าภาระเรือเทียบท่า (PORT DUES)", colSpan: 3, styles: { valign: "middle", halign: "center" } },
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
         lineWidth: 0.1,
         lineColor: [0, 0, 0],
      },
      columnStyles: {
         0: { cellWidth: "auto", halign: "center" },
         1: { cellWidth: 300, halign: "left" },
         2: { cellWidth: "auto", halign: "right" },
         3: { cellWidth: "auto", halign: "right" },
         4: { cellWidth: "auto", halign: "right" },
         5: { cellWidth: "auto", halign: "right" },
      },
      theme: "grid",
   });
   doc.save(`report5-2_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>