<template>
   <div v-if="formGroup && !isLoading" id="survey-result" class="px-4 md:px-6">
      <div class="inner">
         <div class="flex flex-col xs:flex-row justify-between items-center mb-6">
            <h1 class="font-anuphan-semi-bold text-2xl md:text-[30px] text-grayy-400">
               {{ $t("ผลการประเมินความพึงพอใจ") }}
            </h1>
            <UButton class="mx-2 border border-grayy-100 md:w-[50px] h-10 md:h-[40px] justify-center
            w-full xs:w-12 mt-2 xs:mt-0
            " size="md"
               color="gray" :label="$t('close')" @click="navigateTo('/survey')" />
         </div>

         <div class="shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)] rounded-xl bg-white px-4 py-4 md:px-6 md:py-4">
            <h2 class="text-[#1C1C1C] font-anuphan-semi-bold mb-4 text-xl lg:text-2xl">
               ผลวิเคราะห์ความพึงพอใจ
            </h2>
            <div class="flex flex-col lg:flex-row justify-evenly items-center">
               <div class="text-[#1C1C1C] font-anuphan-bold text-4xl lg:text-5xl mb-4 lg:mb-0">
                  {{ formGroup.satisfaction.sum?.toFixed(2) }}%
               </div>
               <div class="w-full max-w-[600px]">
                  <DoughnutChart :values="formGroup.satisfaction.values" />
               </div>
            </div>

            <div class="sections mt-6">
               <template v-for="(section, sectionIndex) in formGroup.sections" :key="sectionIndex">
                  <section v-if="section.typeSection === 'heading'"
                     class="heading bg-[#704a9e] rounded-xl border-4 md:border-[7px] border-[#704A9E] border-solid mt-4 p-4 shadow-md">
                     <h1 class="font-anuphan-semi-bold text-lg text-[#F9FAFB]">{{ section.title }}</h1>
                     <div v-if="section.description" class="text-[#F9FAFB] mt-2">
                        {{ section.description }}
                     </div>
                  </section>

                  <section v-if="section.typeSection === 'question'"
                     class="question bg-white rounded-xl mt-4 p-4 pl-5 shadow-md">
                     <h1 class="text-[#1C1C1C] mb-4 text-base md:text-lg">
                        <span>{{ section.questions![0].question }}</span>
                     </h1>

                     <div v-if="section.questions![0].typeQuestion === 'multiple_choice'" class="mt-4">
                        <div class="flex justify-center max-w-full mx-auto">
                           <div class="w-full lg:w-1/2">
                              <DoughnutChart v-if="section.questions![0]" :values="section.questions![0].options.map((x: any) => ({
                                 ...x,
                                 point: x.optionName,
                              }))" />
                           </div>
                        </div>
                     </div>

                     <div v-else>
                        <template v-for="(question, questionIndex) in section.questions" :key="questionIndex">
                           <UInput v-for="(answer, answerIndex) in question.answers" :key="answerIndex"
                              placeholder="กรอกข้อมูลของคุณ" variant="outline" color="purple" :value="answer" disabled
                              :ui="{ wrapper: `rounded-md mb-4` }" />
                        </template>
                     </div>
                  </section>

                  <section v-if="section.typeSection === 'evaluation'" class="mt-4">
                     <div
                        class="heading bg-[#704a9e] rounded-xl border-4 md:border-[7px] border-[#704A9E] border-solid p-4 shadow-md">
                        <h1 class="font-anuphan-semi-bold text-[#F9FAFB] text-lg md:text-xl">{{ section.title }}</h1>
                        <div v-if="section.description" class="text-[#F9FAFB] mt-2">
                           {{ section.description }}
                        </div>
                     </div>
                     <div class="bg-white p-3 mt-2">
                        <div v-for="(question, questionIndex) in section.questions" :key="questionIndex" class="mb-6">
                           <h2 class="text-[#1C1C1C] mb-4 text-base md:text-lg">{{ question.question }}</h2>
                           <div>
                              <BarChart :chartData="getChartData(section, question)" />
                           </div>
                        </div>
                     </div>
                  </section>
               </template>
            </div>
         </div>
      </div>
   </div>

   <div v-else-if="!formGroup && !isLoading" class="mx-auto my-0 px-4 shadow-md rounded-xl bg-white p-6">
      <div class="header-content flex flex-col md:flex-row items-center justify-center md:justify-start
           bg-[url('~/assets/images/survey/survey-header-bg.jpg')] bg-cover bg-center
           min-h-[200px] md:min-h-[268px] pl-4 md:pl-10 border border-solid rounded-2xl border-[#704A9E] bg-[#704a9e]">
         <div>
            <div class="font-anuphan-bold text-2xl xs:text-3xl md:text-5xl text-white mb-2 md:mb-4">
               ยังไม่มีข้อมูลผลประเมิน
            </div>
            <div class="font-anuphan-medium text-lg xs:text-xl md:text-[30px] text-white">
               เนื่องจากแบบสอบถามนี้ยังไม่เคยมีการตอบ
            </div>
         </div>
      </div>
      <UButton class="mx-2 mt-4 border border-grayy-100 w-12 md:w-[50px] h-10 md:h-[40px] justify-center" size="md"
         color="gray" :label="$t('กลับ')" @click="navigateTo('/survey')" />
   </div>
   <Loading v-if="isLoading" />
</template>


<script setup lang="ts">
import Loading from "~/components/loading.vue";
import DoughnutChart from "~/components/chart/survey/DoughnutChart.vue";
import BarChart from "~/components/chart/survey/BarChart.vue";
import useSurveyService from "~/core/services/surveyService";

const route = useRoute();
const surveyService = useSurveyService();
const query = route.query as { id: string };
const isLoading = ref<boolean>(false);
const formGroup = ref<any>({
   name: "",
   description: "",
   publishSchedule: false,
   publishDate: "",
   endDate: "",
   sections: [],
   satisfaction: {
      sum: 0,
      values: [],
   },
});

onMounted(() => {
   getSurveyResult();
});

const getSurveyResult = async () => {
   isLoading.value = true;
   const res = await surveyService.getSurveyResult(Number(query.id));
   if (res.statusCode === 200) {
      formGroup.value = res.data;
   }
   isLoading.value = false;
};



const getChartData = (section: any, question: any) => {
   const labels = question.values.map((item: any) => `${item.point}`);
   const datasets = [{
      label: section.questions.map((i: any) => i.question),
      data: question.values.map((item: any) => `${item.percentage}`),
      countData: question.values.map((item: any) => `${item.count}`),
      backgroundColor: `#A698EB`,
      borderColor: `#A698EB`,
      borderWidth: 1,
      //barThickness: 90,
      maxBarThickness: 90
   }]
   return { labels, datasets };
};
</script>
