<template>
   <button @click="generatePDF">Generate PDF pdf3</button>
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

const shipDataPdf3Model = [
      {
         document_count: 5,
         userId: 49,
         fullName: "วิชัยมาศ สานสิริ",
         companyName: "sunsu company",
         email: "nutthamon+20@wisdomvast.com",
      },
      {
         document_count: 2,
         userId: 16,
         fullName: "esportTwoZero gameon",
         companyName: "มหาวิทยาลัยเกษตรศาสตร์",
         email: "agency1@gmail.com",
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
   doc.setFontSize(14);

   const textStartY = -20 + logoHeight;
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", pageWidth / 2, textStartY, { align: "center" });
   doc.text("รายงานการยื่นใบคำร้องของตัวแทนเรือ (Agency)", pageWidth / 2, textStartY + 16, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 32, { align: "center" });

   const tableStartY = textStartY + 32 + 10;
   
   const totalDocumentCount: any = props.pdfData.reduce((sum, ship: any) => sum + ship.document_count, 0);
   const tableBody: any = props.pdfData.map((item: any, index: number) => [
      index + 1,
      item.companyName,
      item.document_count,
      ((item.document_count / totalDocumentCount) * 100).toFixed(2),
   ]);

   tableBody.push(["", { content: "รวม", colSpan: 1, styles: { halign: "right", font: "THSarabunNew Bold" } }, totalDocumentCount, "100%"]);

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อบริษัท และเอเย่นต์", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "จำนวน (ลำ)", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "คิดเป็นร้อยละ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
         ],
      ],
      body: tableBody,
      styles: {
         font: "THSarabunNew Bold",
         fontSize: 10,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontStyle: "normal",
         halign: "right",
         fillColor: "#FFFFCC",
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
   doc.save(`report3_${props.joinedThaiDateString}.pdf`);
};
defineExpose({ generatePDF });
</script>
