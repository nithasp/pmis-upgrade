<template>
   <button @click="generatePDF">Generate PDF pdf6</button>
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
        default: []
    },
    pdf6DataTotal: {
        type: Object,
    },
    joinedThaiDateString: {
        type: String,
        default: ""
    }
});

const shipDataPdf6Model = [
   {
      approvedDate: "2024-12-11T00:00:00+07:00",
      total: 1,
      grtLessThan700: 0,
      grt700To2000: 1,
      grtGatherThan2000: 0,
      GrtLessThan700NoBerthAt: 0,
      grt700To2000NoBerthAt: 1,
      grtGatherThan2000NoBerthAt: 0,
      noBerthAt: 0,
      userCancel: 0,
      adminCancel: 0,
   },
];

const shipData6TotalModel = {
   approvedDate: "0001-01-01T00:00:00Z",
   total: 1,
   grtLessThan700: 0,
   grt700To2000: 1,
   grtGatherThan2000: 0,
   GrtLessThan700NoBerthAt: 0,
   grt700To2000NoBerthAt: 1,
   grtGatherThan2000NoBerthAt: 0,
   noBerthAt: 0,
   userCancel: 0,
   adminCancel: 0,
};

function prepareGroupedTableData(shipData: any) {
   return shipData.map((item: any) => {
      const approvedDate = new Date(item.approvedDate).toLocaleDateString("th-TH", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
      });

      return [
         approvedDate,
         item.grtLessThan700,
         item.grt700To2000,
         item.grtGatherThan2000,
         item.total,
         item.grtLessThan700 - item.GrtLessThan700NoBerthAt,
         item.grt700To2000 - item.grt700To2000NoBerthAt,
         item.grtGatherThan2000 - item.grtGatherThan2000NoBerthAt,
         item.userCancel,
         item.adminCancel,
         item.noBerthAt,
      ];
   });
}

function prepareTotalRow(totalData: any) {
   return [
      "รวม",
      totalData.grtLessThan700,
      totalData.grt700To2000,
      totalData.grtGatherThan2000,
      totalData.total,
      totalData.grtLessThan700 - totalData.GrtLessThan700NoBerthAt,
      totalData.grt700To2000 - totalData.grt700To2000NoBerthAt,
      totalData.grtGatherThan2000 - totalData.grtGatherThan2000NoBerthAt,
      totalData.userCancel,
      totalData.adminCancel,
      totalData.noBerthAt,
   ];
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
   doc.setFontSize(16);

   const textStartY = -20 + logoHeight;
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", pageWidth / 2, textStartY, { align: "center" });
   doc.text("รายงานสรุปจำนวนใบคำร้อง (ท่า TCT)", pageWidth / 2, textStartY + 18, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 36, { align: "center" });

   const tableBody = prepareGroupedTableData(props.pdfData);
   tableBody.push(prepareTotalRow(props.pdf6DataTotal));

   const tableOffset = 50;
   autoTable(doc, {
      startY: textStartY + tableOffset,
      head: [
         [
            { content: "วันที่อนุมัติคำร้อง", styles: { valign: "middle", halign: "center" } },
            { content: "GRT <700", styles: { valign: "middle", halign: "center" } },
            { content: "GRT 700-2,000", styles: { valign: "middle", halign: "center" } },
            { content: "GRT >2,000", styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนใบคำร้องรวม", styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนคำร้องฯที่เข้าเทียบท่าแล้ว (GRT <700)", styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนคำร้องฯที่เข้าเทียบท่าแล้ว (GRT 700-2,000)", styles: { halign: "center" } },
            { content: "จำนวนคำร้องฯที่เข้าเทียบท่าแล้ว (GRT >2,000).", styles: { valign: "middle", halign: "center" } },
            { content: "ยกเลิกคำร้องโดยเอเยนต์", styles: { valign: "middle", halign: "center" } },
            { content: "ยกเลิกคำร้องโดยเจ้าหน้าที่", styles: { valign: "middle", halign: "center" } },
            { content: "คำร้องที่ยังไม่ได้เข้าเทียบท่า", styles: { valign: "middle", halign: "center" } },
         ],
      ],
      body: tableBody,
      styles: {
         font: "THSarabunNew",
         fontSize: 14,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontSize: 16,
         fontStyle: "normal",
         halign: "center",
         valign: "middle",
         textColor: "#000000",
         fillColor: "#FFF2CC",
         lineColor: "",
         lineWidth: 0.1,
      },
      bodyStyles: {
         lineWidth: 0.1,
         lineColor: [0, 0, 0],
         halign: "center",
      },
      columnStyles: {
         0: { cellWidth: "auto" },
         1: { cellWidth: "auto" },
         2: { cellWidth: "auto" },
         3: { cellWidth: "auto" },
         4: { cellWidth: "auto" },
         5: { cellWidth: "auto" },
         6: { cellWidth: "auto" },
         7: { cellWidth: "auto" },
         8: { cellWidth: "auto" },
         9: { cellWidth: "auto" },
         10: { cellWidth: "auto" },
      },
      theme: "grid",
   });
   doc.save(`report6_${props.joinedThaiDateString}.pdf`);
}

defineExpose({ generatePDF });
</script>
