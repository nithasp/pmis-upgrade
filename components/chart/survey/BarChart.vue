<template>
  <div class="w-full h-96">
    <Bar ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "vue-chartjs";

ChartJS.register(BarElement, Title, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
 
      plugins: {
        legend: {
          display: false,
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 10,
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: false,
          callbacks: {
            label: function (tooltipItem) {
              const dataset = tooltipItem.dataset;
              const index = tooltipItem.dataIndex;
              const count = dataset.countData[index];
              return `จำนวนคนตอบ: ${count}`;
            },
          },
        },
        datalabels: {
          anchor: "center",
          align: "center",
          formatter: (value, context) => {
            const count = context.dataset.countData[context.dataIndex];
            const num = parseFloat(value);
            const formattedValue = !isNaN(num) ? num.toFixed(2) : value;
            return `${count} คน ${formattedValue}%`;
          },

          font: { weight: "bold" },
          color: 'white',
        },
      }
    }),
  },
});
const chartRef = shallowRef(null);
</script>
