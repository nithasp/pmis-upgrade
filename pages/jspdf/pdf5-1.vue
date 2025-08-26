<template>
   <button @click="generatePDF">Generate PDF pdf5-1</button>
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

const shipDataPdf5_1Model = [
   {
      userId: 49,
      contactName: "วิชัยมาศ สานสิริ",
      companyName: "sunsu company",
      email: "nutthamon+20@wisdomvast.com",
      phone: "09914011532",
      mobilePhone: "01236533338",
      vesselId: 6,
      vesselName: "sdfd",
      userTotal: 856000,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 16547403.4783,
      rTonTotal: 1414616.77,
   },
   {
      userId: 49,
      contactName: "วิชัยมาศ สานสิริ",
      companyName: "sunsu company",
      email: "nutthamon+20@wisdomvast.com",
      phone: "09914011532",
      mobilePhone: "01236533338",
      vesselId: 83,
      vesselName: "Ugreen",
      userTotal: 856000,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 12,
      rTonTotal: 33,
   },
   {
      userId: 16,
      contactName: "esportTwoZero gameon",
      companyName: "มหาวิทยาลัยเกษตรศาสตร์",
      email: "agency1@gmail.com",
      phone: "0999999999",
      mobilePhone: "0999999978",
      vesselId: 8,
      vesselName: "Ocean Star",
      userTotal: 171200,
      portDueTotal: 171200,
      countVessels: 1,
      mTonTotal: 11,
      rTonTotal: 22,
   },
   {
      userId: 16,
      contactName: "esportTwoZero gameon",
      companyName: "มหาวิทยาลัยเกษตรศาสตร์",
      email: "agency1@gmail.com",
      phone: "0999999999",
      mobilePhone: "0999999978",
      vesselId: 1,
      vesselName: "kanompang",
      userTotal: 171200,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 10,
      rTonTotal: 10,
   },
   {
      userId: 18,
      contactName: "music wang",
      companyName: "LOVE song",
      email: "agency2@gmail.com",
      phone: "0999999998",
      mobilePhone: "0999999978",
      vesselId: 83,
      vesselName: "Ugreen",
      userTotal: 0,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 2500,
      rTonTotal: 3500,
   },
   {
      userId: 61,
      contactName: "ohm jinna",
      companyName: "",
      email: "ohm.jinna@gmail.com",
      phone: "0999999999",
      mobilePhone: "",
      vesselId: 68,
      vesselName: "tine soshy",
      userTotal: 0,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 0,
      rTonTotal: 0,
   },
];

function prepareGroupedTableData(shipData: any) {
   const format2 = (num: number) =>
      num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
   const format3 = (num: number) =>
      num.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
   const tableRows = shipData.map((item: any, index: number) => [
      index + 1, // ลำดับ
      item.companyName, // ตัวแทนเรือ
      item.countVessels, // จำนวนเรือ
      format2(item.portDueTotal), // PORT DUES (2 decimals)
      format3(item.mTonTotal), // M/Ton (3 decimals)
      format3(item.rTonTotal), // R/Ton (3 decimals)
      item.contactName, // ชื่อผู้ติดต่อ
      item.phone, // เบอร์โทรศัพท์
      item.mobilePhone, // เบอร์โทรศัพท์สำรอง
      item.email, // อีเมล
   ]);

   const totalCountVessels = shipData.reduce((sum: number, item: any) => sum + item.countVessels, 0);
   const totalPortDueTotal = shipData.reduce((sum: number, item: any) => sum + item.portDueTotal, 0);
   const totalMTonTotal = shipData.reduce((sum: number, item: any) => sum + item.mTonTotal, 0);
   const totalRTonTotal = shipData.reduce((sum: number, item: any) => sum + item.rTonTotal, 0);

   tableRows.push([
      { content: "รวมทั้งหมด", colSpan: 2, styles: { halign: "center", font: "THSarabunNew Bold" } },
      { content: totalCountVessels, styles: { halign: "center", font: "THSarabunNew Bold" } },
      { content: format2(totalPortDueTotal), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: format3(totalMTonTotal), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: format3(totalRTonTotal), styles: { halign: "right", font: "THSarabunNew Bold" } },
      { content: "", colSpan: 2, styles: { halign: "center", font: "THSarabunNew Bold" } },
   ]);
   return tableRows;
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
   doc.text("รายงานตัวแทนเรือต่างประเทศที่เรียงตามจำนวนเรือเข้าจากมากไปน้อย", pageWidth / 2, textStartY + 21, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 40, { align: "center" });

   const tableStartY = textStartY + 50 + 10;
   
   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", styles: { valign: "middle", halign: "center" } },
            { content: "ตัวแทนเรือ", styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนเรือ", styles: { valign: "middle", halign: "center" } },
            { content: "ค่าภาระเรือเทียบท่า (PORT DUES)", styles: { valign: "middle", halign: "center" } },
            { content: "ปริมาณสินค้าผ่านท่า(M/Ton)", styles: { valign: "middle", halign: "center" } },
            { content: "ปริมาณสินค้าผ่านท่า(R/Ton)", styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อผู้ติดต่อ", styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์", styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์สำรอง", styles: { valign: "middle", halign: "center" } },
            { content: "อีเมล", styles: { valign: "middle", halign: "center" } },
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
         1: { halign: "left", cellWidth: 200 },
         2: { halign: "center" },
         3: { halign: "right" },
         4: { halign: "right" },
         5: { halign: "right" },
         6: { halign: "left" },
         7: { halign: "left" },
         8: { halign: "left" },
         9: { halign: "left" },
      },
      theme: "grid",
   });
   doc.save(`report5-1_${props.joinedThaiDateString}.pdf`);
}
defineExpose({ generatePDF });
</script>