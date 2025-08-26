<template>
   <button @click="generatePDF">Generate PDF pdf5-3</button>
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

const shipDataPdf5_3Model = [
   {
      userId: 18,
      fullName: "music wang",
      owner: "Ugreen Company",
      mTon: 1122,
      initialRate: 500,
      portCharges: 561000,
      portChargesVat: 39270,
      portChargesNet: 600270,
   },
];

function prepareGroupedTableData(data: any) {
   const formatNumber = (num: any) =>
      Number(num || 0).toLocaleString("en-US", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      });

   const rows = data.map((item: any, index: any) => [
      index + 1, // ลำดับ
      item.fullName, // ตัวแทนเรือ
      formatNumber(item.mTon), // ปริมาณสินค้าผ่านท่า with formatting
      formatNumber(item.portCharges), // ค่าสินค้าผ่านท่า (ไม่รวม VAT) with formatting
      formatNumber(item.portChargesVat), // VAT with formatting
      formatNumber(item.portChargesNet), // รวม VAT with formatting
   ]);

   const totalMTon = data.reduce((sum: any, i: any) => sum + i.mTon, 0);
   const totalPortCharges = data.reduce((sum: any, i: any) => sum + i.portCharges, 0);
   const totalVat = data.reduce((sum: any, i: any) => sum + i.portChargesVat, 0);
   const totalNet = data.reduce((sum: any, i: any) => sum + i.portChargesNet, 0);

   rows.push([
      { content: "รวมทั้งหมด", colSpan: 2, styles: { halign: "center", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalMTon), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalPortCharges), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalVat), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: formatNumber(totalNet), styles: { halign: "right", font: "THSarabunNew Bold" } },
   ]);
   return rows;
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
   doc.text("รายงานตัวแทนเรือต่างประเทศที่เรียงตามค่าสินค้าผ่านท่าจากมากไปน้อย", pageWidth / 2, textStartY + 21, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 40, { align: "center" });

   const tableStartY = textStartY + 50 + 10;

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ตัวแทนเรือ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
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
   doc.save(`report5-3_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>
