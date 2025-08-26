<template>
   <button @click="generatePDF">Generate PDF pdf2</button>
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

const shipDataPdf2Model: any = [
   {
      name: "mcotmello",
      companyName: "LOVE song",
      phone: "0999999998",
      mooringDate: "2025-03-20T13:13:01+07:00",
      requestDate: "2025-03-19T16:09:51.755+07:00",
      dateDiff: "21:03:09.245",
   },
   {
      name: "Locknlock",
      companyName: "Wisdom",
      phone: "0894456123",
      mooringDate: "2025-03-21T10:34:13+07:00",
      requestDate: "2025-03-21T10:19:02.889+07:00",
      dateDiff: "00:15:10.111",
   },
];

const formatDate = (dateStr: string) => {
   const date = new Date(dateStr);
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const day = date.getDate().toString().padStart(2, "0");
   const year = date.getFullYear();
   return `${month}/${day}/${year}`;
};

const formatTime = (dateStr: string) => {
   const date = new Date(dateStr);
   const hours = date.getHours().toString().padStart(2, "0");
   const minutes = date.getMinutes().toString().padStart(2, "0");
   return `${hours}:${minutes}`;
};

const formatDuration = (duration: string) => {
   return duration.substring(0, 5);
};

const formatShipData = (data: any[]): any[] => {
   return data.map((item, index) => [
      { content: index + 1, styles: { halign: "center" } }, // ลำดับ
      { content: formatDate(item.mooringDate), styles: { halign: "center" } }, // วันที่
      { content: item.name, styles: { halign: "left" } }, // ชื่อเรือ
      { content: item.companyName, styles: { halign: "left" } }, // บริษัทเอเยน
      { content: item.phone, styles: { halign: "left" } }, // เบอร์โทร
      { content: formatDate(item.mooringDate), styles: { halign: "center" } }, // เรือเข้าเทียบท่า – วันที่
      { content: formatTime(item.mooringDate), styles: { halign: "center" } }, // เรือเข้าเทียบท่า – เวลา
      { content: formatDate(item.requestDate), styles: { halign: "center" } }, // วันที่ยื่นระบบคำร้อง – วันที่
      { content: formatTime(item.requestDate), styles: { halign: "center" } }, // วันที่ยื่นระบบคำร้อง – เวลา
      { content: formatDuration(item.dateDiff), styles: { halign: "center" } }, // ชม. (HH:mm)
   ]);
};

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

   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "วันที่", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อเรือ", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "บริษัทเอเยน", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทร", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "เรือเข้าเทียบท่า", colSpan: 2, styles: { valign: "middle", halign: "center" } },
            { content: "วันที่ยื่นระบบคำร้อง", colSpan: 2, styles: { halign: "center" } },
            { content: "ชม.", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
         ],
         [
            { content: "วันที่", styles: { halign: "center" } },
            { content: "เวลา", styles: { halign: "center" } },
            { content: "วันที่", styles: { halign: "center" } },
            { content: "เวลา", styles: { halign: "center" } },
         ],
      ],
      body: formatShipData(props.pdfData),
      styles: {
         font: "THSarabunNew",
         fontSize: 10,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontStyle: "normal",
         halign: "right",
         fillColor: "#FFFFFF",
         textColor: "#000000",
         lineColor: "",
         lineWidth: 0.1,
      },
      bodyStyles: {
         lineWidth: 0.1,
         lineColor: "",
      },
      columnStyles: {
         0: { cellWidth: "auto" },
         1: { cellWidth: "auto" },
         2: { cellWidth: "auto" },
         3: { cellWidth: "auto" },
         4: { cellWidth: 100 },
         5: { cellWidth: 100 },
         6: { cellWidth: 100 },
         7: { cellWidth: 100 },
         8: { cellWidth: "auto" },
         9: { cellWidth: "auto" },
      },
      theme: "grid",
   });
   doc.save(`report2_${props.joinedThaiDateString}.pdf`);
};

defineExpose({ generatePDF });
</script>
