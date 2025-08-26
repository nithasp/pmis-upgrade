<template>
   <div v-if="!isLoading" id="survey-answer" class="max-w-[1143px] mx-auto my-0">
      <div class="inner">
         <div class="bg-top shadow-[0px_1px_4px_0px_rgba(0,0,0,0.16)] rounded-[20px] bg-white p-6">
            <div
               class="header-content flex items-center bg-[url('~/assets/images/survey/survey-header-answer-bg.jpg')] bg-cover bg-center min-h-[307px] pl-10 border-[#704A9E] bg-[#704a9e] rounded-2xl border-[7px] border-solid"
            ></div>
         </div>
         <header class="flex items-center p-4 bg-[#704a9e] rounded-2xl border-[7px] border-[#704A9E] border-solid mt-4 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]">
            <div>
               <div class="font-anuphan-bold text-3xl text-[#F9FAFB] mb-4">{{ formGroup.name }}</div>
               <div class="font-anuphan-medium text-[#F9FAFB] max-w-[850px]">{{ formGroup.description }}</div>
            </div>
         </header>
         <div class="sections">
            <template v-for="(section, sectionIndex) in formGroup.sections" :key="sectionIndex">
               <section
                  v-if="section.typeSection === 'heading'"
                  class="heading bg-[#704a9e] rounded-xl border-[7px] border-[#704A9E] border-solid mt-4 p-4 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]"
               >
                  <h1 class="font-anuphan-semi-bold text-lg text-[#F9FAFB]">{{ section.title }}</h1>
                  <div v-if="section.description" class="text-[#F9FAFB] mt-2">{{ section.description }}</div>
               </section>

               <section v-if="section.typeSection === 'question'" class="question bg-white rounded-xl mt-4 p-4 pl-5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]">
                  <h1 class="text-[#1C1C1C]">
                     <span>{{ section.questions![0].question }}</span>
                     <span v-if="section.isRequired" class="text-[#F04438]">*</span>
                  </h1>

                  <div v-if="section.questions![0].typeQuestion === 'multiple_choice'" 
                  class="mt-4 flex flex-wrap gap-6 xs:gap-12">
                     <URadio
                        v-for="(optionItem, optionIndex) in section.questions![0].options"
                        :key="optionIndex"
                        v-model="selectedOptions[section.questions![0].id]"
                        :value="optionItem.id"
                        :label="optionItem.optionName"
                        :ui="{
                           wrapper: '!cursor-pointer',
                           inner: 'm-0 ml-2 text-[#344054]',
                           label: 'font-anuphan-medium',
                           ring: 'w-[23px] h-[23px] border-[1.5px] border-solid border-[#D0D5DD]',
                        }"
                        class="!cursor-pointer"
                     />
                  </div>

                  <div v-else>
                     <template v-for="(question, questionIndex) in section.questions" :key="questionIndex">
                        <UInput
                           v-if="question.typeQuestion === 'short_answer'"
                           placeholder="กรอกข้อมูลของคุณ"
                           variant="none"
                           v-model="answers[question.id]"
                           :ui="{
                              base: 'mt-4 border-b border-[#667085] focus:ring-0 focus:outline-none focus:border-[#667085]',
                              rounded: 'rounded-none',
                           }"
                        />
                        <UTextarea
                           v-else-if="question.typeQuestion === 'paragraph'"
                           placeholder="กรอกข้อมูลของคุณ"
                           variant="none"
                           v-model="answers[question.id]"
                           :ui="{
                              base: 'mt-4 border border-[#667085] focus:ring-0 focus:outline-none focus:border-[#667085]',
                              rounded: 'rounded-xl',
                           }"
                        />
                     </template>
                  </div>
               </section>

               <section v-if="section.typeSection === 'evaluation'">
                  <div class="heading bg-[#704a9e] rounded-xl border-[7px] border-[#704A9E] border-solid mt-4 p-4 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]">
                     <h1 class="font-anuphan-semi-bold text-[#F9FAFB]">{{ section.title }}</h1>
                     <div v-if="section.description" class="text-[#F9FAFB] mt-2">{{ section.description }}</div>
                  </div>
                  <div class="bg-white p-6">
                     <div v-for="(question, questionIndex) in section.questions" :key="questionIndex" class="mb-6">
                        <div>
                           <h2 class="text-[#1C1C1C]">{{ question.question }}</h2>
                        </div>
                        <div class="flex justify-between items-end mt-4">
                           <div class="text-[#344054]">{{ section.satisfactionDesMin }}</div>
                                       <div
                              :class="['grid justify-items-center w-[70%]']"
                              :style="{ gridTemplateColumns: `repeat(${Math.max(1, section.satisfactionMax! - section.satisfactionMin! + 1)}, minmax(0, 1fr))` }"
                           >
                              <URadio
                                 v-for="value in Array.from(
                                    { length: section.satisfactionMax! - section.satisfactionMin! + 1 },
                                    (_, i) => section.satisfactionMin! + i
                                 )"
                                 :key="value"
                                 v-model="selectedSatisfaction[question.id]"
                                 :value="value"
                                 :label="value.toString()"
                                 :ui="{
                                    wrapper: 'flex-col flex-col-reverse gap-4',
                                    inner: 'm-0 ml-2 text-[#344054]',
                                    label: 'font-anuphan-medium',
                                    ring: 'w-[23px] h-[23px] border-[1.5px] border-solid border-[#D0D5DD]',
                                 }"
                              />
                           </div>
                           <div class="text-[#344054]">{{ section.satisfactionDesMax }}</div>
                        </div>
                     </div>
                  </div>
               </section>
            </template>
         </div>
      </div>
   </div>
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">

import Loading from "~/components/loading.vue";
import useSurveyService from "~/core/services/surveyService";
import type { ISurveyDetail } from "~/core/interfaces/ISurvey";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const surveyService = useSurveyService();
const isLoading = ref<boolean>(false);
const answers = ref<Record<number, string>>({});
const selectedSatisfaction = ref<Record<number, number>>({});
const selectedOptions = ref<Record<number, number | undefined>>({});
const formGroup = ref<ISurveyDetail>({
   id: undefined,
   name: "",
   description: "",
   publishSchedule: false,
   publishDate: "",
   endDate: "",
   sections: [],
});

onMounted(() => {
   getSurveyDetail();
});

const getSurveyDetail = async () => {
   isLoading.value = true;
   const res = await surveyService.getSurveyDetail(Number(route.query.id));
   const isSuccess = res.statusCode === 200;
   if (isSuccess) {
      formGroup.value = res.data as ISurveyDetail;
   }
   isLoading.value = false;
};
</script>
