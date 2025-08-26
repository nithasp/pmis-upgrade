<template>
   <button @click="generatePDF">Generate PDF pdf4-1</button>
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

const shipDataPdf4_1Model: any = [
   {
      userId: 48,
      contactName: "Mark Diaz",
      companyName: "Byrd, Carter and Fitzgerald",
      email: "cschneider@hotmail.com",
      phone: "5497282085",
      mobilePhone: "90110964754",
      vesselId: 19,
      vesselName: "Home Ship",
      userTotal: 691659,
      portDueTotal: 691659,
      countVessels: 3,
      mTonTotal: 3057.8,
      rTonTotal: 4918.3,
   },
   {
      userId: 68,
      contactName: "Robin Rodriguez",
      companyName: "",
      email: "monica50@yahoo.com",
      phone: "5925271964",
      mobilePhone: "21823541497",
      vesselId: 59,
      vesselName: "Environmental Ship",
      userTotal: 935437,
      portDueTotal: 935437,
      countVessels: 1,
      mTonTotal: 17082.1,
      rTonTotal: 2108.2,
   },
   {
      userId: 48,
      contactName: "Jerry Crawford",
      companyName: "Garcia and Sons",
      email: "james47@weaver.com",
      phone: "8268929460",
      mobilePhone: "",
      vesselId: 19,
      vesselName: "Top Ship",
      userTotal: 52264,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 7481.6,
      rTonTotal: 19518.2,
   },
   {
      userId: 48,
      contactName: "Bridget Martinez",
      companyName: "Bush-Fernandez",
      email: "diane49@walter-orr.com",
      phone: "2337423989",
      mobilePhone: "",
      vesselId: 69,
      vesselName: "Floor Ship",
      userTotal: 45132,
      portDueTotal: 45132,
      countVessels: 1,
      mTonTotal: 19649.8,
      rTonTotal: 1118.4,
   },
   {
      userId: 73,
      contactName: "Peter Lopez",
      companyName: "Fleming-Williams",
      email: "andrew07@andrews-mendez.net",
      phone: "9165725210",
      mobilePhone: "",
      vesselId: 4,
      vesselName: "Across Ship",
      userTotal: 672596,
      portDueTotal: 672596,
      countVessels: 3,
      mTonTotal: 4367.8,
      rTonTotal: 233.3,
   },
   {
      userId: 52,
      contactName: "Nicholas Best",
      companyName: "Huff Inc",
      email: "megan20@terrell.com",
      phone: "3180995021",
      mobilePhone: "",
      vesselId: 19,
      vesselName: "Development Ship",
      userTotal: 524650,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 2818.1,
      rTonTotal: 17725.2,
   },
   {
      userId: 68,
      contactName: "Jason Bowers",
      companyName: "",
      email: "aschneider@yahoo.com",
      phone: "3332394408",
      mobilePhone: "",
      vesselId: 98,
      vesselName: "Beat Ship",
      userTotal: 355077,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 3740.2,
      rTonTotal: 16400.1,
   },
   {
      userId: 78,
      contactName: "Christopher Beasley",
      companyName: "",
      email: "trevinomary@yahoo.com",
      phone: "1050954026",
      mobilePhone: "93077700616",
      vesselId: 64,
      vesselName: "Feel Ship",
      userTotal: 625358,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 6965.6,
      rTonTotal: 7486.8,
   },
   {
      userId: 52,
      contactName: "Anna Johnston",
      companyName: "",
      email: "sheri45@rivera.com",
      phone: "4614091064",
      mobilePhone: "",
      vesselId: 22,
      vesselName: "Attorney Ship",
      userTotal: 919671,
      portDueTotal: 919671,
      countVessels: 3,
      mTonTotal: 16546.6,
      rTonTotal: 8434.6,
   },
   {
      userId: 73,
      contactName: "Maxwell Boyd",
      companyName: "Martin, Robinson and Gutierrez",
      email: "gstewart@yahoo.com",
      phone: "3328482122",
      mobilePhone: "",
      vesselId: 71,
      vesselName: "Sport Ship",
      userTotal: 386996,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 370.7,
      rTonTotal: 6990.3,
   },
   {
      userId: 59,
      contactName: "Jasmin Dixon",
      companyName: "Hudson, Donovan and Yoder",
      email: "hernandezkim@hotmail.com",
      phone: "6579031584",
      mobilePhone: "",
      vesselId: 49,
      vesselName: "Politics Ship",
      userTotal: 17095,
      portDueTotal: 0,
      countVessels: 3,
      mTonTotal: 4948.4,
      rTonTotal: 16926.2,
   },
   {
      userId: 78,
      contactName: "Christopher Hughes",
      companyName: "",
      email: "haley01@campbell.com",
      phone: "4944706441",
      mobilePhone: "99789531544",
      vesselId: 41,
      vesselName: "Senior Ship",
      userTotal: 143749,
      portDueTotal: 143749,
      countVessels: 2,
      mTonTotal: 6497.3,
      rTonTotal: 2781.2,
   },
   {
      userId: 45,
      contactName: "Daniel Woods",
      companyName: "Sharp, Mitchell and Freeman",
      email: "blake92@hotmail.com",
      phone: "5277603582",
      mobilePhone: "12937839254",
      vesselId: 83,
      vesselName: "Campaign Ship",
      userTotal: 375981,
      portDueTotal: 0,
      countVessels: 3,
      mTonTotal: 5497.4,
      rTonTotal: 15517.6,
   },
   {
      userId: 73,
      contactName: "Brianna Wolfe",
      companyName: "Kelley-Garcia",
      email: "bairdkristen@horton.net",
      phone: "4502174524",
      mobilePhone: "21130010609",
      vesselId: 83,
      vesselName: "Where Ship",
      userTotal: 169531,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 4307.5,
      rTonTotal: 7710.0,
   },
   {
      userId: 78,
      contactName: "Joseph Alexander",
      companyName: "Kelly LLC",
      email: "smithdarrell@rodgers.com",
      phone: "1414312527",
      mobilePhone: "",
      vesselId: 23,
      vesselName: "Suggest Ship",
      userTotal: 324033,
      portDueTotal: 0,
      countVessels: 3,
      mTonTotal: 9473.6,
      rTonTotal: 2796.4,
   },
   {
      userId: 73,
      contactName: "Mr. Marc Johnson",
      companyName: "",
      email: "hclark@hotmail.com",
      phone: "2015862739",
      mobilePhone: "",
      vesselId: 93,
      vesselName: "General Ship",
      userTotal: 314328,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 7252.5,
      rTonTotal: 7358.0,
   },
   {
      userId: 68,
      contactName: "David Fox",
      companyName: "",
      email: "ncase@davis.com",
      phone: "9530277898",
      mobilePhone: "12784727159",
      vesselId: 9,
      vesselName: "Trip Ship",
      userTotal: 329621,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 11721.1,
      rTonTotal: 19904.6,
   },
   {
      userId: 78,
      contactName: "Connie Davis",
      companyName: "Potter Group",
      email: "ojackson@yahoo.com",
      phone: "3712943759",
      mobilePhone: "19146073762",
      vesselId: 38,
      vesselName: "Foot Ship",
      userTotal: 870779,
      portDueTotal: 0,
      countVessels: 1,
      mTonTotal: 6874.2,
      rTonTotal: 7678.1,
   },
   {
      userId: 50,
      contactName: "Terry Mann II",
      companyName: "Rivers-Hernandez",
      email: "joseph06@yahoo.com",
      phone: "3502506096",
      mobilePhone: "03981623659",
      vesselId: 31,
      vesselName: "Medical Ship",
      userTotal: 424913,
      portDueTotal: 0,
      countVessels: 2,
      mTonTotal: 10725.5,
      rTonTotal: 14002.5,
   },
   {
      userId: 48,
      contactName: "Kathleen Mills",
      companyName: "Greene and Sons",
      email: "jimmyshaw@gmail.com",
      phone: "8492160644",
      mobilePhone: "06289432504",
      vesselId: 51,
      vesselName: "Operation Ship",
      userTotal: 918125,
      portDueTotal: 0,
      countVessels: 3,
      mTonTotal: 10754.1,
      rTonTotal: 11660.6,
   },
];

function prepareGroupedTableData(shipData: any) {
   const grouped: any = {};
   const result = [];

   shipData.forEach((item: any) => {
      if (!grouped[item.userId]) {
         grouped[item.userId] = {
            userId: item.userId,
            contactName: item.contactName,
            companyName: item.companyName,
            email: item.email,
            phone: item.phone,
            mobilePhone: item.mobilePhone,
            vessels: [],
            totalPortDue: 0,
            totalMTon: 0,
            totalRTon: 0,
            totalCountVessels: 0,
         };
      }

      grouped[item.userId].vessels.push(item);
      grouped[item.userId].totalPortDue += item.portDueTotal;
      grouped[item.userId].totalMTon += item.mTonTotal;
      grouped[item.userId].totalRTon += item.rTonTotal;
      grouped[item.userId].totalCountVessels += item.countVessels;
   });

   let groupIndex = 1;
   for (const userId in grouped) {
      const group = grouped[userId];
      const vessels: any = group.vessels;

      vessels.forEach((vessel: any, index: any) => {
         if (index === 0) {
            result.push([
               { rowSpan: vessels.length + 1, content: String(groupIndex) },
               { rowSpan: vessels.length + 1, content: group.companyName },
               vessel.vesselName,
               String(vessel.countVessels),
               String(vessel.portDueTotal),
               String(vessel.mTonTotal),
               String(vessel.rTonTotal),
               { rowSpan: vessels.length + 1, content: group.contactName },
               { rowSpan: vessels.length + 1, content: group.phone },
               { rowSpan: vessels.length + 1, content: group.mobilePhone },
               { rowSpan: vessels.length + 1, content: group.email },
            ]);
         } else {
            result.push([vessel.vesselName, String(vessel.countVessels), String(vessel.portDueTotal), String(vessel.mTonTotal), String(vessel.rTonTotal)]);
         }
      });

      result.push([{ content: "รวม" }, String(group.totalCountVessels), String(group.totalPortDue), String(group.totalMTon), String(group.totalRTon)]);

      groupIndex++;
   }

   return result;
}

const generatePDF = () => {
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
   doc.text("รายงานตัวแทนเรือไทยที่เรียงตามจำนวนเรือเข้าจากมากไปน้อย", pageWidth / 2, textStartY + 21, { align: "center" });
   doc.text(`ประจำวันที่ ${props.joinedThaiDateString}`, pageWidth / 2, textStartY + 40, { align: "center" });

   const tableStartY = textStartY + 50 + 10;
 
   autoTable(doc, {
      startY: tableStartY,
      head: [
         [
            { content: "ลำดับ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ตัวแทนเรือ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "เจ้าของเรือ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "จำนวนเรือ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ค่าธรรมเนียมท่าเรือ (PORT DUES)", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ปริมาณสินค้าผ่านท่าเทียบ (W/Ton)", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ปริมาณสินค้าผ่านท่าเทียบ (R/Ton)", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "ชื่อผู้ติดต่อ", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "เบอร์โทรศัพท์สำรอง", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
            { content: "อีเมล", rowSpan: 1, styles: { valign: "middle", halign: "center" } },
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
         lineColor: "",
      },
      columnStyles: {
         0: { halign: "center" },
         1: { halign: "left", cellWidth: 100 },
         2: { halign: "left", cellWidth: 100 },
         3: { halign: "center" },
         4: { halign: "right" },
         5: { halign: "right" },
         6: { halign: "right" },
         7: { halign: "left", cellWidth: 100 },
         8: { halign: "left" },
         9: { halign: "left" },
         10: { halign: "left" },
      },
      theme: "grid",
   });
   doc.save(`report4-1_${props.joinedThaiDateString}.pdf`);
};
defineExpose({ generatePDF });
</script>
