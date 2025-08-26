<template>
   <button @click="generatePDF">Generate PDF pdf7</button>
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

const shipDataPdf7Model = [
   {
      approvedDate: "2024-12-11T00:00:00+07:00",
      companyName: "Wisdom",
      contactName: "Nawin",
      phone: "0691654489",
      mobilePhone: "",
      email: "nawin@wisdomvast.com",
      createdAt: "2024-09-18T14:48:47.951+07:00",
   },
   {
      approvedDate: "2024-12-12T00:00:00+07:00",
      companyName: "Mana Software Co., Ltd.",
      contactName: "Witchayut Ketudom",
      phone: "0822806987",
      mobilePhone: "",
      email: "witchayut.k2@gmail.com",
      createdAt: "2024-12-12T09:32:31.467+07:00",
   },
];

function prepareGroupedTableData(shipData: any) {
   return shipData.map((ship: any, index: any) => {
      const approvedDate = new Date(ship.approvedDate);
      const day = approvedDate.getDate().toString().padStart(2, "0");
      const month = (approvedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = approvedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      return [
         index + 1, // ลำดับ (order number)
         formattedDate, // วันที่อนุมัติลงทะเบียน (approved date)
         ship.companyName, // ชื่อบริษัท (company name)
         ship.contactName, // ชื่อผู้ติดต่อ (contact name)
         ship.phone, // เบอร์โทรศัพท์ (phone)
         ship.mobilePhone, // เบอร์โทรศัพท์สำรอง (mobile phone)
         ship.email, // E-mail
      ];
   });
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
   doc.setFontSize(16);

   const textStartY = -20 + logoHeight;
   doc.text("สำนักงานท่าเรืออุตสาหกรรมมาบตาพุด", pageWidth / 2, textStartY, { align: "center" });
   doc.text("รายงานการอนุมัติคำขอลงทะเบียนตัวแทนเรือใหม่ (Agency)", pageWidth / 2, textStartY + 18, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 36, { align: "center" });

   const tableOffset = 50;
   const tableBody = prepareGroupedTableData(props.pdfData);
   autoTable(doc, {
      startY: textStartY + tableOffset,
      head: [
         [
            { content: "ลำดับ", styles: { valign: "middle", halign: "center" } },
            { content: "วันที่อนุมัติลงทะเบียน", styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อบริษัท", styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อผู้ติดต่อ", styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์", styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์สำรอง", styles: { valign: "middle", halign: "center" } },
            { content: "E-mail", styles: { valign: "middle", halign: "center" } },
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
         fontSize: 12,
         fontStyle: "normal",
         halign: "center",
         valign: "middle",
         textColor: "#ffffff",
         fillColor: "#70AD47",
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
      },
      theme: "grid",
      didDrawCell: function (data) {
         if (data.section === "body" && data.column.index === 6) {
            const { doc } = data;
            const email = data.cell.text[0];
            const textWidth = doc.getTextWidth(email);
            const textX = data.cell.x + (data.cell.width - textWidth) / 2;
            const fontSize = 14;
            const textHeight = fontSize;
            const textY = data.cell.y + (data.cell.height - textHeight) / 2;
            doc.link(textX, textY, textWidth, textHeight, { url: `mailto:${email}` });

            const underlineY = data.cell.y + data.cell.height / 2 + 7;
            doc.setDrawColor(0, 0, 255);
            doc.setLineWidth(1);
            doc.line(textX, underlineY, textX + textWidth, underlineY);
         }
      },
      didParseCell: function (data: any) {
         if (data.section === "body" && data.column.index === 6) {
            data.cell.styles.textColor = "#0000FF";
            data.cell.styles.fontStyle = "underline";
         }
      },
   });
   doc.save(`report7_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>
