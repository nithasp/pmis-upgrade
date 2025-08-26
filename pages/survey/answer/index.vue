<template>
   <div v-if="!isLoading" id="survey-answer" class="max-w-[1143px] mx-auto my-0">
      <!-- <h1 @click="console.log(formGroup)">formGroup</h1>
      <h1 @click="console.log(selectedOptions)">selectedOptions</h1> -->
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

               <section
                  v-if="section.typeSection === 'question'"
                  :id="'section-' + section.id"
                  class="question bg-white rounded-xl mt-4 p-4 pl-5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]"
               >
                  <h1 class="text-[#1C1C1C]">
                     <span>{{ section.questions![0].question }}</span>
                     <span v-if="section.isRequired" class="text-[#F04438]">*</span>
                  </h1>

                  <div v-if="section.questions![0].typeQuestion === 'multiple_choice'" class="mt-4 flex gap-12">
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
                           placeholder="กรอกข้อมูลของคุณ"
                           variant="none"
                           v-model="answers[question.id]"
                           :ui="{
                              base: 'mt-4 border-b border-[#667085] focus:ring-0 focus:outline-none focus:border-[#667085]',
                              rounded: 'rounded-none',
                           }"
                        />
                     </template>
                  </div>
               </section>

               <section v-if="section.typeSection === 'evaluation'" 
               :id="'section-' + section.id"
               class="mt-4 rounded-xl shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)] overflow-hidden"
               >
                  <div class="heading p-4 bg-[#704a9e]  border-[7px] border-[#704A9E] border-solid ">
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
         <div class="mt-4">
            <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-auto h-auto" outlined size="md" @click="handleSubmit">
               <template #default>
                  <div class="flex gap-2 w-full justify-center">
                     <img :src="PaperPlaneWhiteIcon" alt="paper-plane-white-icon" class="w-5 h-5" />
                     <span>{{ $t("ส่งแบบสอบถาม") }}</span>
                  </div>
               </template>
            </UButton>
         </div>
      </div>
   </div>
   <DialogConfirm
      :icon="dialogConfirmProps.icon"
      :title="dialogConfirmProps.title"
      :desc="dialogConfirmProps.desc"
      :type="dialogConfirmProps.type"
      :colorConfirm="dialogConfirmProps.colorConfirm"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')"
      :isDialogOpen="isDialogConfirmOpen"
      :dialogCancel="dialogConfirmCancel"
      :dialogConfirm="dialogConfirm"
   />
   <DialogAlert
      :title="dialogAlertProps.title"
      :desc="dialogAlertProps.desc"
      :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen"
      :setDialog="handleCloseDialogAlert"
      :btnName="$t('close')"
   />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import PaperPlaneWhiteIcon from "~/assets/icons/fi-rs-paper-plane-white.svg";
import useSurveyService from "~/core/services/surveyService";
import type { ISurveyDetail, ISurveyDetailSection, ISurveyDetailQuestion } from "~/core/interfaces/ISurvey";
import type { IDialogConfirmProps, IDialogAlertProps } from "~/core/interfaces/IDialog";

const { t } = useI18n();
const route = useRoute();
const routeQueryToken = route.query.token;
const surveyService = useSurveyService();
const isLoading = ref<boolean>(false);
const answers = ref<Record<number, string>>({});
const selectedSatisfaction = ref<Record<number, number>>({});
const selectedOptions = ref<Record<number, number | undefined>>({});
const formGroup = ref<ISurveyDetail>({
   name: "",
   description: "",
   publishSchedule: false,
   publishDate: "",
   endDate: "",
   sections: [],
});
const dialogConfirmProps = ref<IDialogConfirmProps>({
   title: "",
   desc: "",
   type: "",
   icon: "",
   colorConfirm: "",
});
const dialogAlertProps = ref<IDialogAlertProps>({
   title: "",
   desc: "",
   type: "",
});

onMounted(() => {
   getUserCheckTokenSurvey();
});

const getUserCheckTokenSurvey = async () => {
   isLoading.value = true;
   const token = Array.isArray(routeQueryToken) ? routeQueryToken[0] : routeQueryToken;

   if (!token) {
      console.error("Invalid token value");
      isLoading.value = false;
      return;
   }

   try {
      const res = await surveyService.getUserCheckTokenSurvey(token);
      const isSuccess = res.statusCode === 200;
      if (isSuccess) {
         if (res.data.code === "success_survey") {
            navigateTo("/survey/success");
         } else {
            formGroup.value = res.data;
         }
      } else {
         navigateTo("/survey/timeout");
      }
   } catch (error) {
      console.error("Error fetching survey token:", error);
   } finally {
      isLoading.value = false;
   }
};

const handleSubmit = () => {
   const unansweredRequiredSections = new Set<number>();

   formGroup.value.sections.forEach((section: ISurveyDetailSection) => {
      if (section.isRequired) {
         section.questions?.forEach((question: ISurveyDetailQuestion) => {
            if (
               (question.typeQuestion === "short_answer" || question.typeQuestion === "paragraph") &&
               (!answers.value[question.id] || answers.value[question.id].trim() === "")
            ) {
               unansweredRequiredSections.add(Number(section.id));
            } else if (
               question.typeQuestion === "multiple_choice" &&
               (selectedOptions.value[question.id] === null || selectedOptions.value[question.id] === undefined)
            ) {
               unansweredRequiredSections.add(Number(section.id));
            } else if (
               section.typeSection === "evaluation" &&
               (selectedSatisfaction.value[question.id] === null || selectedSatisfaction.value[question.id] === undefined)
            ) {
               unansweredRequiredSections.add(Number(section.id));
            }
         });
      }
   });

   if (unansweredRequiredSections.size > 0) {
      const firstUnansweredSectionId = Array.from(unansweredRequiredSections)[0];
      const sectionElement = document.querySelector(`#section-${firstUnansweredSectionId}`);

      if (sectionElement) {
         sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
         sectionElement.classList.add("highlight-section");
      }
      return;
   }

   dialogConfirmProps.value = {
      title: t("ตอบแบบสอบถาม"),
      desc: t("คุณยืนยันการตอบแบบสอบถามนี้ใช่หรือไม่"),
      icon: "warning",
      type: "",
      colorConfirm: "",
   };
   isDialogConfirmOpen.value = true;
};

const isDialogAlertOpen = ref<boolean>(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   if (dialogAlertProps.value.type === "success") {
      navigateTo("/survey/success");
   }
};

const isDialogConfirmOpen = ref<boolean>(false);
   const dialogConfirm = async () => {
   const payload = {
      token: routeQueryToken,
      surveyId: formGroup.value.id,
      questions: formGroup.value.sections.flatMap((section: ISurveyDetailSection) =>
         section.questions?.map((question: ISurveyDetailQuestion) => {
            if (question.typeQuestion === "short_answer" || question.typeQuestion === "paragraph") {
               return {
                  questionId: question.id,
                  ansText: answers.value[question.id] || "",
               };
            } else if (question.typeQuestion === "multiple_choice") {
               return {
                  questionId: question.id,
                  ansOptionId: selectedOptions.value[question.id] ?? null,
               };
            } else if (section.typeSection === "evaluation") {
               return {
                  questionId: question.id,
                  ansPoint: selectedSatisfaction.value[question.id] ?? null,
               };
            }
            return null;
         }) || []
      ),
   };

   isLoading.value = true;
   const res = await surveyService.userSubmitSurvey(payload);
   const isSuccess = res.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("บันทึกตอบแบบสอบถาม") : res.message,
      desc: t(isSuccess ? "การตอบแบบสอบถามของคุณสำเร็จแล้ว" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};

const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};
</script>


<style lang="scss" scoped>
.highlight-section {
   border: 2px solid red !important;
}
</style>
