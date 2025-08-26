<template>
   <button @click="generatePDF">Generate PDF pdf1</button>
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
    joinedThaiDateString: {
        type: String,
        default: ""
    }
});

const shipDataPdf1Model = [
   {
      companyName: "",
      allDoc: 3,
      hourDoc: 0,
      percentageAllDoc: 0,
      percentageHourDoc: 0,
   },
   {
      companyName: "LOVE song",
      allDoc: 2,
      hourDoc: 1,
      percentageAllDoc: 50,
      percentageHourDoc: 5.8824,
   },
   {
      companyName: "sunsu company",
      allDoc: 8,
      hourDoc: 0,
      percentageAllDoc: 0,
      percentageHourDoc: 0,
   },
   {
      companyName: "Wisdom",
      allDoc: 3,
      hourDoc: 1,
      percentageAllDoc: 33.3333,
      percentageHourDoc: 5.8824,
   },
   {
      companyName: "มหาวิทยาลัยเกษตรศาสตร์",
      allDoc: 1,
      hourDoc: 0,
      percentageAllDoc: 0,
      percentageHourDoc: 0,
   },
];

const generatePDF = () => {
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

   doc.setFont("THSarabunNew", "normal");
   doc.setFontSize(12);

   const textStartY = -20 + logoHeight;
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", pageWidth / 2, textStartY, { align: "center" });
   doc.text("ผู้ประกอบการยื่นใบคำร้องล่าช้า (ยื่นไม่ถึง 24 ชม.)", pageWidth / 2, textStartY + 16, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 32, { align: "center" });

   const tableStartY = textStartY + 32 + 10;

   const tableBody = props.pdfData.map((item: any, index: number) => [
      index + 1,
      item.companyName,
      item.allDoc,
      item.hourDoc,
      item.percentageAllDoc.toFixed(2) + "%",
      item.percentageHourDoc.toFixed(2) + "%",
   ]);

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "บริษัทเอเยน", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนเข้าท่าเทียบทั้งหมด", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนที่ยื่นคำร้องไม่ถึง 24 ชม.", colSpan: 1, styles: { halign: "center" } },
            { content: "คิดเป็นร้อยละของผู้ประกอบการทั้งหมด", colSpan: 1, styles: { halign: "center" } },
            { content: "คิดเป็นร้อยละของจำนวนเรือเข้าท่า", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
         ],
      ],
      body: tableBody,
      styles: {
         font: "THSarabunNew",
         fontSize: 12,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontSize: 12,
         fontStyle: "normal",
         halign: "right",
         fillColor: "#FFFFFF",
         textColor: "#000000",
         lineColor: "",
         lineWidth: 0.1,
      },
      bodyStyles: {
         halign: "center",
         lineWidth: 0.1,
         lineColor: "",
      },
      theme: "grid",
   });
   doc.save(`report1_${props.joinedThaiDateString}.pdf`);
};

defineExpose({ generatePDF });
</script>