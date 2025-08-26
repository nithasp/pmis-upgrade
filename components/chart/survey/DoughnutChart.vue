<template>
   <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const props = defineProps<{ values: { point: any; count: number; percentage: number }[] }>();

const createChartData = (values: any) => {
   const sortedValues =
      values ?
         values
            .filter((item: any) => item.count > 0)
            .sort((a: any, b: any) => b.point - a.point)
         : []

   return {
      labels: sortedValues.map((item: any) => `  ${item.point}:   ${item.percentage.toFixed(2)}%`),
      datasets: [
         {
            label: "Satisfaction Levels",
            data: sortedValues.map((item: any) => item.percentage),
            backgroundColor: ["#5D45DB", "#8876E5", "#A698EB", "#D3CCF5", "#ECE9FF"],
            cutout: "40%",
            borderWidth: 0,
            spacing: 0,
         },
      ],
   };
};

const chartData = computed(() => createChartData(props.values));
const chartOptions: any = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
      legend: {
         display: true,
         position: "right",
         labels: {
            usePointStyle: true,
            padding: 20,
            font: {
               size: 14,
            },
         },
      },
      tooltip: {
         enabled: false,
         callbacks: {
            label: function (tooltipItem: any) {
               let dataset = tooltipItem.dataset;
               let total = dataset.data.reduce((a: any, b: any) => a + b, 0);
               let value = dataset.data[tooltipItem.dataIndex];
               let percentage = ((value / total) * 100).toFixed(2) + "%";
               return `${tooltipItem.label}: ${percentage}`;
            },
         },
      },
      datalabels: {
         color: (context: any) => {
            const point = props.values[context.dataIndex]?.point;
            return point <= 3 ? "#5D45DB" : "white";
         },
         backgroundColor: (context: any) => {
            const point = props.values[context.dataIndex]?.point;
            return point <= 3 ? "#ECE9FF" : "#7A65E2";
         },
         borderRadius: 4,
         padding: 6,
         anchor: "center",
         align: "center",
         font: {
            weight: "bold",
            size: 14,
         },
         formatter: (value: any, ctx: any) => {
            let total = ctx.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
            let percentage = ((value / total) * 100).toFixed(0) + "%";
            return percentage;
         },
      },
   },
};
</script>