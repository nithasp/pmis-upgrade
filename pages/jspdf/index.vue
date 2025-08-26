<template>
   <button @click="generatePDF">Generate PDF index</button>
</template>

<script setup>
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./THSarabunNew-normal";
import "./THSarabunNew Bold-normal";

function generatePDF() {
   const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
   });

   // Add title and subtitles
   doc.setFont("THSarabunNew", "normal");
   doc.setFontSize(14);
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

   doc.setFontSize(12);
   doc.text("ผู้ประกอบการยื่นใบคำร้องล่าช้า (ยื่นไม่ถึง 24 ชม.)", doc.internal.pageSize.getWidth() / 2, 46, { align: "center" });
   doc.text("ประจำวันที่ 23 มีนาคม 2025 - 30 มีนาคม 2025", doc.internal.pageSize.getWidth() / 2, 61, { align: "center" });

   const startY = 80;

   // Your ship data array
   const shipData = [
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

   // Map the ship data to table rows
   const tableBody = shipData.map((ship, index) => [
      index + 1, // ลำดับ
      ship.companyName, // บริษัทเอเยน
      ship.allDoc, // จำนวนเข้าท่าเทียบทั้งหมด
      ship.hourDoc, // จำนวนที่ยื่นคำร้องไม่ถึง 24 ชม.
      ship.percentageAllDoc, // คิดเป็นร้อยละของผู้ประกอบการทั้งหมด
      ship.percentageHourDoc, // คิดเป็นร้อยละของจำนวนเรือเข้าท่า
   ]);

   autoTable(doc, {
      startY: startY,
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
      headStyles: {
         font: "THSarabunNew Bold",
         fontSize: 10,
         cellPadding: 4,
      },
      headStyles: {
         font: "THSarabunNew Bold",
         fontStyle: "normal",
         halign: "right",
         fillColor: [255, 255, 255], // White background
         textColor: [0, 0, 0], // Black text
         lineColor: [0, 0, 0], // Black border
         lineWidth: 0.1, // Border width
      },
      bodyStyles: {
         halign: "center", // Center text for body cells
         lineWidth: 0.1,
         lineColor: [0, 0, 0],
      },
      theme: "grid",
   });

   // Save the PDF
   doc.save("mockup-report.pdf");
}
</script>
