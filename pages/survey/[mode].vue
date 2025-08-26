<template>
   <div id="survey" class="p-4">
     <header class="flex flex-col lg:flex-row items-center justify-between">
       <h1 class="font-anuphan-semi-bold text-2xl lg:text-[30px] text-black py-4">
         {{ $t("แบบสอบถามความพึงพอใจ") }}
       </h1>
       <div class="flex flex-wrap gap-2">
         <UButton
           class="mr-2 border border-error-500 text-error-500 bg-white hover:bg-white w-full sm:w-[67px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('cancel')"
           @click="navigateTo('/survey')"
         />
         <UButton
           v-if="isEdit"
           class="mr-2 border border-[#D0D5DD] text-[#344054] bg-white hover:bg-white w-full sm:w-auto h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('แสดงตัวอย่าง')"
           @click="openInNewTab(`/survey/answer/view?id=${query.id}`)"
         />
         <UButton
           class="mr-2 border border-[#E3D4F6] text-[#704A9E] bg-[#E3D4F6] hover:bg-[#E3D4F6] w-full sm:w-auto h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('บันทึก')"
           @click="handleSubmit"
         />
         <UButton
           v-if="isEdit"
           class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto"
           outlined
           size="md"
           @click="handleSendEmailSurvey(true)"
         >
           <template #default>
             <div class="flex gap-2 w-full justify-center">
               <span>{{ $t("บันทึกและส่ง") }}</span>
               <img :src="PaperPlaneWhiteIcon" alt="paper-plane-white-icon" class="w-5 h-5" />
             </div>
           </template>
         </UButton>
       </div>
     </header>
 
     <div class="content mt-6">
       <div class="main-topic">
         <div class="bg-white rounded-3xl p-6 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.16)]">
           <div class="topic">
             <div>
               <Input
                 :label="$t('ชื่อแบบสอบถาม')"
                 :placeholder="$t('ชื่อแบบสอบถาม')"
                 v-model="formGroup.name"
                 class="w-full"
                 :class="{ 'error-input': isFieldError('name') }"
                 :error="isFieldError('name') ? fieldValidation.name.message : ''"
                 :required="!isView"
                 :isView="isView"
               />
             </div>
             <div class="mt-3">
               <Input
                 :label="$t('คำอธิบายฟอร์ม')"
                 :placeholder="$t('คำอธิบายฟอร์ม')"
                 v-model="formGroup.description"
                 class="w-full"
                 :class="{ 'error-input': isFieldError('description') }"
                 :error="isFieldError('description') ? fieldValidation.description.message : ''"
                 :required="!isView"
                 :isView="isView"
               />
             </div>
             <div class="mt-3">
               <UFormGroup name="view_dashboard_document">
                 <Checkbox :label="$t('กำหนดช่วงเวลาเผยแพร่')" v-model="formGroup.publishSchedule" @change="toggleSelection" />
               </UFormGroup>
             </div>
             <div
               v-if="formGroup.publishSchedule"
               class="flex flex-col md:flex-row gap-4 mt-3"
             >
               <UFormGroup :label="$t('วันที่เริ่มเผยแพร่')" class="w-full md:w-6/12" required>
                 <UPopover :popper="{ placement: 'bottom-start' }">
                   <Input
                     name="publishDate"
                     size="md"
                     variant="outline"
                     color="purple"
                     v-model="formGroup.publishDate"
                     :value="formGroup.publishDate ? format(new Date(formGroup.publishDate), 'd MMM, yyyy') : ''"
                     :placeholder="$t('วันที่เริ่มเผยแพร่')"
                     :class="{ 'error-input': isFieldError('publishDate') }"
                     :error="isFieldError('publishDate') ? fieldValidation.publishDate.message : ''"
                     :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                   />
                   <template #panel="{ close }">
                     <Datepicker v-model="publishDate" @close="close" is-required is24hr type="normal" mode="date" @date-change="onPublishDateChange" />
                   </template>
                 </UPopover>
               </UFormGroup>
 
               <UFormGroup :label="$t('วันที่สิ้นสุดเผยแพร่')" class="w-full md:w-6/12" required>
                 <UPopover :popper="{ placement: 'bottom-start' }">
                   <Input
                     name="endDate"
                     size="md"
                     variant="outline"
                     color="purple"
                     v-model="formGroup.endDate"
                     :value="formGroup.endDate ? format(new Date(formGroup.endDate), 'd MMM, yyyy') : ''"
                     :placeholder="$t('วันที่สิ้นสุดเผยแพร่')"
                     :class="{ 'error-input': isFieldError('endDate') }"
                     :error="isFieldError('endDate') ? fieldValidation.endDate.message : ''"
                     :ui="{ wrapper: 'w-full rounded-md bg-white' }"
                   />
                   <template #panel="{ close }">
                     <Datepicker v-model="endDate" @close="close" is-required is24hr type="normal" mode="date" @date-change="onEndDateChange" />
                   </template>
                 </UPopover>
               </UFormGroup>
             </div>
           </div>
         </div>
 
         <div class="mt-8 relative">
           <div class="flex justify-center">
             <div class="flex flex-wrap gap-4 relative bg-[#eeebf2] px-4 z-[1]">
               <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('heading')">
                 <template #default>
                   <div class="flex gap-2 w-full justify-center">
                     <img :src="LetterCaseIcon" alt="letter-case-icon" class="w-5 h-5" />
                     <span>{{ $t("เพิ่มหัวข้อ") }}</span>
                   </div>
                 </template>
               </UButton>
               <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('question')">
                 <template #default>
                   <div class="flex gap-2 w-full justify-center">
                     <img :src="CommentIcon" alt="comment-icon" class="w-5 h-5" />
                     <span>{{ $t("เพิ่มคำถาม") }}</span>
                   </div>
                 </template>
               </UButton>
               <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('evaluation')">
                 <template #default>
                   <div class="flex gap-2 w-full justify-center">
                     <img :src="ChartPieAltIcon" alt="chart-icon" class="w-5 h-5" />
                     <span>{{ $t("เพิ่มส่วนประเมิน") }}</span>
                   </div>
                 </template>
               </UButton>
             </div>
           </div>
           <div class="line absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#b7a4ce] h-0.5 w-full"></div>
         </div>
       </div>
 
       <div class="sections">
         <template v-for="(section, index) in formGroup.sections.filter((s: ISurveyDetailSection) => !s.isDelete)" :key="index">
           <section v-if="section.typeSection === 'heading'" id="heading" class="relative section">
             <div class="relative bg-white rounded-3xl px-6 pt-6 pb-4 mt-4 overflow-hidden">
               <div class="absolute top-0 left-0 bg-[#704A9E] h-2.5 w-full"></div>
               <div>
                 <div>
                   <Input
                     :label="$t('หัวข้อ')"
                     :placeholder="$t('หัวข้อ')"
                     v-model="section.title"
                     class="w-full"
                     :class="{ 'error-input': isFieldError('sectionTitle', index) }"
                     :error="isFieldError('sectionTitle', index) ? fieldValidation[`section_${index}_title`].message : ''"
                     :isView="isView"
                     :required="!isView"
                   />
                 </div>
                 <div class="mt-3">
                   <Input
                     v-if="section.typeSection === 'heading'"
                     :label="$t('คำอธิบาย')"
                     :placeholder="$t('คำอธิบาย')"
                     v-model="section.description"
                     class="w-full"
                     :class="{ 'error-input': isFieldError('questions', index) }"
                     :isView="isView"
                   />
                 </div>
                 <div class="bg-[#B7A4CE] h-0.5 w-full mt-4"></div>
                 <div class="flex justify-end mt-4">
                   <img :src="TrashIcon" alt="trash-icon" class="w-5 h-5 cursor-pointer" @click="removeSection(section)" />
                 </div>
               </div>
             </div>

             <div class="mt-4 relative">
               <div class="flex justify-center">
                 <div class="flex flex-wrap gap-4 relative bg-[#eeebf2] px-4 z-[1]">
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('heading')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="LetterCaseIcon" alt="letter-case-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มหัวข้อ") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('question')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="CommentIcon" alt="comment-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มคำถาม") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('evaluation')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="ChartPieAltIcon" alt="chart-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มส่วนประเมิน") }}</span>
                       </div>
                     </template>
                   </UButton>
                 </div>
               </div>
               <div class="line absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#b7a4ce] h-0.5 w-full"></div>
             </div>
           </section>
 
           <section v-if="section.typeSection === 'evaluation'" id="evaluation" class="relative section">
             <div class="relative bg-white rounded-3xl px-6 pt-6 pb-4 mt-4 overflow-hidden">
               <div class="absolute top-0 left-0 bg-[#704A9E] h-2.5 w-full"></div>
               <div class="topic">
                 <div>
                   <Input
                     :label="$t('หัวข้อ')"
                     :placeholder="$t('หัวข้อ')"
                     v-model="section.title"
                     class="w-full"
                     :class="{ 'error-input': isFieldError('sectionTitle', index) }"
                     :error="isFieldError('sectionTitle', index) ? fieldValidation[`section_${index}_title`].message : ''"
                     :isView="isView"
                     :required="!isView"
                   />
                 </div>
                 <div class="mt-3">
                   <Input
                     :label="$t('คำอธิบาย')"
                     :placeholder="$t('คำอธิบาย')"
                     v-model="section.description"
                     class="w-full"
                     :class="{ 'error-input': isFieldError('questions', index) }"
                     :isView="isView"
                   />
                 </div>
                 <div class="dashed-line h-px w-full mt-4"></div>
               </div>
               <div class="question mt-4">
                 <template v-for="(question, questionIndex) in section.questions" :key="questionIndex">
                   <div :class="[questionIndex !== 0 ? 'mt-2' : '', 'flex flex-row gap-4 w-full justify-center relative']">
                     <Input :label="$t('คำถาม')" :placeholder="$t('คำถาม')" v-model="question.question" class="w-full" :isView="isView" />
                     <img
                       :src="CrossSmallIcon"
                       alt="cross-small-icon"
                       class="w-3 h-3 cursor-pointer mt-9"
                       @click="removeQuestion(index, questionIndex, question, section)"
                     />
                   </div>
                 </template>
                 <UButton
                   class="bg-white text-[#704A9E] [&_span]:font-anuphan-semi-bold w-auto h-auto mt-4 hover:bg-white p-0"
                   outlined
                   size="md"
                   @click="section.questions!.push({ question: '' } as ISurveyPayloadQuestion)"
                 >
                   <template #default>
                     <div class="flex gap-2 w-full justify-center relative">
                       <img :src="PlusIcon" alt="plus-icon" class="w-5 h-5" />
                       <span>{{ $t("เพิ่มคำถาม") }}</span>
                       <div class="absolute bottom-[-4px] left-0 w-full h-[1px] bg-[#704A9E]"></div>
                     </div>
                   </template>
                 </UButton>
                 <div class="dashed-line h-px w-full mt-4"></div>
               </div>
               <div class="satisfaction mt-4">
                 <div class="flex flex-row gap-2 items-center">
                   <div class="font-anuphan-semi-bold text-[#704A9E]">
                     ระดับความพึงพอใจ ตั้งแต่ <span>{{ section.satisfactionMin }}</span> ถึง
                   </div>
                   <div class="max-w-[87px] w-full">
                     <Select :placeholder="$t('เลือก')" :options="satisfactionPointOption" v-model="section.satisfactionMax" />
                   </div>
                 </div>
                 <div class="mt-6">
                   <div class="flex  flex-row gap-4 items-center">
                     <span class="font-anuphan-semi-bold text-[#704A9E]">{{ section.satisfactionMin }}</span>
                     <Input :placeholder="$t('คำอธิบาย')" v-model="section.satisfactionDesMin" class="w-full" :isView="isView" />
                   </div>
                   <div class="flex flex-row gap-4 items-center mt-6">
                     <span class="font-anuphan-semi-bold text-[#704A9E]">{{ section.satisfactionMax }}</span>
                     <Input :placeholder="$t('คำอธิบาย')" v-model="section.satisfactionDesMax" class="w-full" :isView="isView" />
                   </div>
                 </div>
               </div>
               <div class="bg-[#B7A4CE] h-0.5 w-full mt-4"></div>
               <div class="flex justify-end mt-4">
                 <div class="flex justify-end gap-4">
                   <img :src="TrashIcon" alt="trash-icon" class="w-5 h-5 cursor-pointer" @click="removeSection(section)" />
                   <UFormGroup name="view_dashboard_document">
                     <Checkbox :label="$t('บังคับกรอก')" v-model="section.isRequired" @change="section.isRequired = $event" />
                   </UFormGroup>
                 </div>
               </div>
             </div>

             <div class="mt-4 relative">
               <div class="flex justify-center">
                 <div class="flex flex-wrap gap-4 relative bg-[#eeebf2] px-4 z-[1]">
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('heading')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="LetterCaseIcon" alt="letter-case-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มหัวข้อ") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('question')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="CommentIcon" alt="comment-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มคำถาม") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('evaluation')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="ChartPieAltIcon" alt="chart-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มส่วนประเมิน") }}</span>
                       </div>
                     </template>
                   </UButton>
                 </div>
               </div>
               <div class="line absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#b7a4ce] h-0.5 w-full"></div>
             </div>
           </section>
 
           <section v-if="section.typeSection === 'question'" id="question" class="relative section">
             <div class="relative bg-white rounded-3xl px-6 pt-6 pb-4 mt-4">
               <div class="absolute left-0 top-0 h-3 overflow-hidden w-full">
                 <div class="absolute top-px left-0 bg-[#704A9E] w-full h-5 rounded-tl-[1.5rem] rounded-tr-[1.5rem]"></div>
               </div>
 
               <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                 <div class="col-span-1">
                   <Input
                     :label="$t('คำถาม')"
                     :placeholder="$t('คำถาม')"
                     v-model="section.questions![0].question"
                     class="w-full"
                     :isView="isView"
                     :required="!isView"
                     :class="{ 'error-input': isFieldError('questions', index) }"
                     :error="isFieldError('questions', index) ? $t('required') : ''"
                   />
                 </div>
                 <div class="col-span-1 mt-2 md:mt-0">
                   <Select
                     :label="$t('ประเภทคำถาม')"
                     :placeholder="$t('เลือก')"
                     :options="questionTypeOption"
                     v-model="section.questions![0].typeQuestion"
                   />
                 </div>
 
                 <div v-if="section.questions![0].typeQuestion === 'multiple_choice'" class="col-span-1 md:col-span-2 multiple-question mt-4">
                   <div
                     v-for="(option, optionIndex) in section.questions![0].options"
                     :key="optionIndex"
                     :class="[optionIndex !== 0 ? 'mt-5' : '', 'flex flex-col sm:flex-row gap-4 items-center']"
                   >
                     <div class="flex gap-4 w-full">
                       <img :src="CheckboxIcon" alt="checkbox-icon" class="w-5 h-5 cursor-pointer mt-[10px]" />
                       <Input
                         :placeholder="$t('คำตอบ')"
                         v-model="option.optionName"
                         class="w-full"
                         :isView="isView"
                         :class="{ 'error-input': isFieldError('optionName', index, optionIndex) }"
                         :error="isFieldError('optionName', index, optionIndex) ? $t('required') : ''"
                       />
                       <img
                         :src="CrossSmallIcon"
                         alt="cross-small-icon"
                         class="w-3 h-3 cursor-pointer mt-3"
                         @click="removeOption(section.id, 0, optionIndex)"
                       />
                     </div>
                   </div>
 
                   <UButton
                     class="bg-white text-[#704A9E] [&_span]:font-anuphan-semi-bold w-auto h-auto mt-4 hover:bg-white p-0"
                     outlined
                     size="md"
                     @click="addOptionToMultipleChoice(section)"
                   >
                     <template #default>
                       <div class="flex gap-2 w-full justify-center relative">
                         <img :src="PlusIcon" alt="plus-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มตัวเลือก") }}</span>
                         <div class="absolute bottom-[-4px] left-0 w-full h-[1px] bg-[#704A9E]"></div>
                       </div>
                     </template>
                   </UButton>
                 </div>
                 <div class="col-span-1 md:col-span-2 bg-[#B7A4CE] h-0.5 w-full mt-4"></div>
                 <div class="col-span-1 md:col-span-2 flex justify-end mt-4">
                   <div class="flex justify-end gap-4">
                     <img :src="TrashIcon" alt="trash-icon" class="w-5 h-5 cursor-pointer" @click="removeSection(section)" />
                     <UFormGroup name="view_dashboard_document">
                       <Checkbox :label="$t('บังคับกรอก')" v-model="section.isRequired" />
                     </UFormGroup>
                   </div>
                 </div>
               </div>
             </div>

             <div class="mt-4 relative">
               <div class="flex justify-center">
                 <div class="flex flex-wrap gap-4 relative bg-[#eeebf2] px-4 z-[1]">
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('heading')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="LetterCaseIcon" alt="letter-case-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มหัวข้อ") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('question')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="CommentIcon" alt="comment-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มคำถาม") }}</span>
                       </div>
                     </template>
                   </UButton>
                   <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="addSection('evaluation')">
                     <template #default>
                       <div class="flex gap-2 w-full justify-center">
                         <img :src="ChartPieAltIcon" alt="chart-icon" class="w-5 h-5" />
                         <span>{{ $t("เพิ่มส่วนประเมิน") }}</span>
                       </div>
                     </template>
                   </UButton>
                 </div>
               </div>
               <div class="line absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#b7a4ce] h-0.5 w-full"></div>
             </div>
           </section>
         </template>
       </div>
     </div>
 
     <div class="flex flex-col sm:flex-row justify-end">
       <div class="flex flex-wrap my-8 gap-2">
         <UButton
           class="mr-2 border border-error-500 text-error-500 bg-white hover:bg-white w-full sm:w-[67px] h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('cancel')"
           @click="navigateTo('/survey')"
         />
         <UButton
           class="mr-2 border border-[#D0D5DD] text-[#344054] bg-white hover:bg-white w-full sm:w-auto h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('แสดงตัวอย่าง')"
           @click="openInNewTab(`/survey/answer/view?id=${query.id}`)"
         />
         <UButton
           class="mr-2 border border-[#E3D4F6] text-[#704A9E] bg-[#E3D4F6] hover:bg-[#E3D4F6] w-full sm:w-auto h-[36px] justify-center"
           size="md"
           color="gray"
           :label="$t('บันทึก')"
           @click="handleSubmit"
         />
         <UButton class="bg-[#704A9E] text-white [&_span]:font-anuphan-semi-bold w-full sm:w-auto h-auto" outlined size="md" @click="isDialogSendEmailSurveyOpen = true">
           <template #default>
             <div class="flex gap-2 w-full justify-center">
               <span>{{ $t("บันทึกและส่ง") }}</span>
               <img :src="PaperPlaneWhiteIcon" alt="paper-plane-white-icon" class="w-5 h-5" />
             </div>
           </template>
         </UButton>
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
     <DialogSendEmailSurvey
       :isDialogOpen="isDialogSendEmailSurveyOpen"
       :dialogCancel="dialogSendEmailSurveyCancel"
       :dialogConfirm="dialogSendEmailSurveyConfirm"
       :surveyId="Number(query.id)"
     />
     <Loading v-if="isLoading" />
   </div>
 </template>
 

<script setup lang="ts">
import Input from "~/components/form/u-input.vue";
import Select from "~/components/form/u-select.vue";
import Datepicker from "~/components/form/v-datepicker.vue";
import Checkbox from "~/components/form/checkbox.vue";
import Loading from "~/components/loading.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogSendEmailSurvey from "~/components/dialog/survey/send-email-survey.vue";
import PaperPlaneWhiteIcon from "~/assets/icons/fi-rs-paper-plane-white.svg";
import LetterCaseIcon from "~/assets/icons/fi-rs-letter-case.svg";
import TrashIcon from "~/assets/icons/fi-rs-trash-primary.svg";
import CommentIcon from "~/assets/icons/fi-rs-comment.svg";
import ChartPieAltIcon from "~/assets/icons/fi-rs-chart-pie-alt.svg";
import PlusIcon from "~/assets/icons/fi-rs-plus.svg";
import CheckboxIcon from "~/assets/icons/checkbox.svg";
import CrossSmallIcon from "~/assets/icons/fi-rs-cross-small.svg";
import { format } from "date-fns";
import useSurveyService from "~/core/services/surveyService";
import type { IDialogConfirmProps, IDialogAlertProps } from "~/core/interfaces/IDialog";
import type { ISurveyPayload, ISurveyPayloadSection, ISurveyPayloadQuestion, ISurveyDetailSection, ISurveyDetail } from "~/core/interfaces/ISurvey";

const route = useRoute();
const query = route.query as { id: string };
const isEdit = route.params.mode === "edit";
const isView = route.params.mode === "view";
const { t, locale } = useI18n();
const surveyService = useSurveyService();
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

const isDialogAlertOpen = ref<boolean>(false);
const isDialogConfirmOpen = ref<boolean>(false);
const isDialogSendEmailSurveyOpen = ref<boolean>(false);
const publishDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const isLoading = ref<boolean>(false);
const formGroup = ref<ISurveyDetail>({
   name: "",
   description: "",
   publishSchedule: false,
   publishDate: "",
   endDate: "",
   sections: [],
});
const deletedSection = ref<ISurveyPayloadSection[]>([]);
const deletedQuestion = ref<ISurveyPayloadQuestion[]>([]);
const satisfactionPointOption = ref([
   { id: 1, name: 1 },
   { id: 2, name: 2 },
   { id: 3, name: 3 },
   { id: 4, name: 4 },
   { id: 5, name: 5 },
]);
const questionTypeOption = ref([
   { id: "short_answer", name: "คำตอบสั้น" },
   { id: "paragraph", name: "ย่อหน้า" },
   { id: "multiple_choice", name: "หลายตัวเลือก" },
]);
const sectionTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

onMounted(() => {
   if (isEdit || isView) {
      getSurveyDetail();
   }
});

watch(
   () => formGroup.value.sections,
   (sections: ISurveyPayloadSection[]) => {
      sections.forEach((section: ISurveyPayloadSection) => {
         if (section.questions && section.questions.length > 0 && section.questions[0].typeQuestion === "multiple_choice") {
            if (!section.questions[0].options || section.questions[0].options.length === 0) {
               section.questions[0].options = [{ optionName: "" }];
            }
         }
      });
   },
   { deep: true }
);

const toggleSelection = (value: boolean) => {
   formGroup.value.publishSchedule = value;
   if (!value) {
      formGroup.value.publishDate = "";
      formGroup.value.endDate = "";
   }
};

const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
   if (dialogAlertProps.value.type === "success") {
      navigateTo("/survey");
   }
};

const dialogConfirm = async () => {
   isLoading.value = true;
   const updatedSections = formGroup.value.sections.map((section: ISurveyPayloadSection) => {
      const deletedQuestions = deletedQuestion.value.filter((q: ISurveyPayloadQuestion) => q.section_id === section.id);
      return {
         ...section,
         ...(section.questions ? { questions: [...section.questions, ...deletedQuestions] } : {}),
      };
   });

   const payload = {
      ...formGroup.value,
      sections: [...updatedSections, ...deletedSection.value].map((section: ISurveyPayloadSection) => {
         const { id, ...rest } = section;
         return {
            ...rest,
            ...(typeof id === "string" ? {} : { id }),
            questions:
               section.typeSection === "evaluation"
                  ? section.questions!.map((question: ISurveyPayloadQuestion) => ({
                       id: question.id ? question.id : null,
                       question: question.question,
                       isDelete: question.isDelete ? question.isDelete : false,
                    }))
                  : section.questions,
         };
      }),
   };

   const res = isEdit ? await surveyService.updateSurvey(Number(query.id), payload) : await surveyService.createSurvey(payload);

   const isSuccess = res.statusCode === 200;
   dialogAlertProps.value = {
      title: isSuccess ? t("บันทึกแบบสอบถาม") : res.message,
      desc: t(isSuccess ? "การบันทึกแบบสอบถามของคุณสำเร็จแล้ว" : ""),
      type: isSuccess ? "success" : "danger",
   };
   isDialogAlertOpen.value = true;
   isDialogConfirmOpen.value = false;
   isLoading.value = false;
};

const dialogConfirmCancel = () => {
   isDialogConfirmOpen.value = false;
};

const handleSubmit = () => {
   allFieldPristine();
   if (!isFormGroupValid(formGroup.value)) {
      scrollToFirstError();
      return;
   }
   dialogConfirmProps.value = {
      title: t("บันทึกสัญญา"),
      desc: t("คุณยืนยันการบันทึกสัญญานี้ใช่หรือไม่"),
      icon: "warning",
   };
   isDialogConfirmOpen.value = true;
};

const scrollToFirstError = () => {
   nextTick(() => {
      const errorFields = document.querySelectorAll(".error-input");

      if (errorFields.length > 0) {
         const firstErrorField = errorFields[0];
         const errorSection = firstErrorField.closest(".section");

         if (errorSection) {
            errorSection.scrollIntoView({ behavior: "smooth", block: "center" });
         } else {
            firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
         }
      }
   });
};

const fieldValidation = ref<Record<string, { message: string; pristine: boolean }>>({
   name: { message: "", pristine: false },
   description: { message: "", pristine: false },
   publishDate: { message: "", pristine: false },
   endDate: { message: "", pristine: false },
});

const allFieldPristine = (pristineValue: boolean = true) => {
   Object.keys(fieldValidation.value).forEach((key) => {
      fieldValidation.value[key].pristine = pristineValue;
   });

   formGroup.value.sections.forEach((section, sectionIndex) => {
 
      if (section.typeSection === "heading" || section.typeSection === "evaluation") {
         const key = `section_${sectionIndex}_title`;
         if (!fieldValidation.value[key]) {
            fieldValidation.value[key] = { message: "", pristine: false };
         }
         fieldValidation.value[key].pristine = pristineValue;
      }
    
      if (section.typeSection === "question") {
         const key = `section_${sectionIndex}_question`;
         if (!fieldValidation.value[key]) {
            fieldValidation.value[key] = { message: "", pristine: false };
         }
         fieldValidation.value[key].pristine = pristineValue;
    
         if (section.questions && section.questions.length > 0 && section.questions[0].typeQuestion === "multiple_choice") {
            section.questions[0].options!.forEach((option, optionIndex) => {
               const optionKey = `section_${sectionIndex}_option_${optionIndex}`;
               if (!fieldValidation.value[optionKey]) {
                  fieldValidation.value[optionKey] = { message: "", pristine: false };
               }
               fieldValidation.value[optionKey].pristine = pristineValue;
            });
         }
      }
   });
};


const isFieldError = (
   field: "name" | "description" | "publishDate" | "endDate" | "questions" | "optionName" | "sectionTitle",
   sectionIndex?: number,
   optionIndex?: number
) => {
   if (field === "sectionTitle" && sectionIndex !== undefined) {
      const key = `section_${sectionIndex}_title`;
      if (!fieldValidation.value[key]) {
         return false;
      }
      const pristine = fieldValidation.value[key].pristine;
      if (!pristine) {
         return false;
      }
      const section = formGroup.value.sections[sectionIndex];
      return !section.title!.trim();
   }
 
   if (field === "questions" && sectionIndex !== undefined) {
      const key = `section_${sectionIndex}_question`;
      if (!fieldValidation.value[key]) {
         return false;
      }
      const pristine = fieldValidation.value[key].pristine;
      const section = formGroup.value.sections[sectionIndex];
      if (!pristine) {
         return false;
      }
      if (section?.questions && section.questions.length > 0) {
         return !section.questions[0].question.trim();
      }
   }
   if (field === "optionName" && sectionIndex !== undefined && optionIndex !== undefined) {
      const key = `section_${sectionIndex}_option_${optionIndex}`;
      if (!fieldValidation.value[key]) {
         return false;
      }
      const pristine = fieldValidation.value[key].pristine;
      const section = formGroup.value.sections[sectionIndex];
      if (!pristine) {
         return false;
      }
      if (section?.questions && section.questions.length > 0 && section.questions[0].options) {
         return !section.questions[0].options[optionIndex].optionName.trim();
      }
   }
  
   if (!fieldValidation.value[field]) {
      return false;
   }
   const pristine = fieldValidation.value[field].pristine;
   if (!pristine) {
      return false;
   }
   const value = formGroup.value[field as keyof ISurveyDetail];
   if (!value) {
      fieldValidation.value[field].message = t("required");
      return true;
   }
   if (field === "endDate" && typeof value === 'string' && formGroup.value.publishDate && new Date(value) < new Date(formGroup.value.publishDate)) {
      fieldValidation.value[field].message = t("วันที่สิ้นสุดเผยแพร่ต้องมากกว่าหรือเท่ากับวันที่เริ่มเผยแพร่");
      return true;
   }
   return false;
};

const isFormGroupValid = (form: ISurveyDetail) => {
   const { publishSchedule, publishDate, endDate, sections, ...selectedFields } = form;
   const allOtherFieldsValid = Object.values(selectedFields).every((value) => value);
   if (publishSchedule) {
      if (!publishDate || !endDate || new Date(endDate) < new Date(publishDate)) {
         fieldValidation.value.publishDate.message = !publishDate ? t("required") : "";
         fieldValidation.value.endDate.message = !endDate
            ? t("required")
            : endDate && publishDate && new Date(endDate) < new Date(publishDate)
            ? t("วันที่สิ้นสุดเผยแพร่ต้องมากกว่าหรือเท่ากับวันที่เริ่มเผยแพร่")
            : "";
         return false;
      }
   }
   let isValid = allOtherFieldsValid;
   sections.forEach((section, sectionIndex) => {
      if (section.typeSection === "heading" || section.typeSection === "evaluation") {
         const key = `section_${sectionIndex}_title`;
         if (!fieldValidation.value[key]) {
            fieldValidation.value[key] = { message: "", pristine: false };
         }
         if (!section.title?.trim()) {
            fieldValidation.value[key].message = t("required");
            isValid = false;
         }
      }
      if (section.typeSection === "question") {
         const questionKey = `section_${sectionIndex}_question`;
         if (!fieldValidation.value[questionKey]) {
            fieldValidation.value[questionKey] = { message: "", pristine: false };
         }
         if (!section.questions || section.questions.length === 0 || !section.questions[0].question.trim()) {
            fieldValidation.value[questionKey].message = t("required");
            isValid = false;
         }
         if (section.questions && section.questions[0].typeQuestion === "multiple_choice") {
            section.questions[0].options!.forEach((option, optionIndex) => {
               const optionKey = `section_${sectionIndex}_option_${optionIndex}`;
               if (!fieldValidation.value[optionKey]) {
                  fieldValidation.value[optionKey] = { message: "", pristine: false };
               }
               if (!option.optionName.trim()) {
                  fieldValidation.value[optionKey].message = t("required");
                  isValid = false;
               }
            });
         }
      }
   });
   return isValid;
};

const onPublishDateChange = (newDate: Date) => {
   formGroup.value.publishDate = newDate ? new Date(newDate).toISOString() : "";
};
const onEndDateChange = (newDate: Date) => {
   formGroup.value.endDate = newDate ? new Date(newDate).toISOString() : "";
};

const getSurveyDetail = async () => {
   isLoading.value = true;
   const res = await surveyService.getSurveyDetail(Number(query.id));
   const isSuccess = res.statusCode === 200;
   if (isSuccess) {
      formGroup.value = {
         ...res.data,
         sections: res.data.sections ? res.data.sections : [],
      };
   }
   isLoading.value = false;
};

const addSection = (typeSection: string) => {
   clearTimeout(sectionTimeout.value!);
   const newSection: Partial<ISurveyPayloadSection> = {
      id: generateRandomId(),
      typeSection,
   };

   if (typeSection === "heading") {
      formGroup.value.sections.push({
         ...newSection,
         title: "",
         description: "",
      } as ISurveyPayloadSection);
   }

   if (typeSection === "evaluation") {
      formGroup.value.sections.push({
         ...newSection,
         title: "",
         description: "",
         questions: [{ question: "" } as ISurveyPayloadQuestion],
         satisfactionMin: 1,
         satisfactionDesMin: "",
         satisfactionMax: 5,
         satisfactionDesMax: "",
         isRequired: false,
      } as ISurveyPayloadSection);
   }

   if (typeSection === "question") {
      const sectionIndex = formGroup.value.sections.length;
      formGroup.value.sections.push({
         ...newSection,
         questions: [
            {
               question: "",
               typeQuestion: "short_answer",
               options: [],
            },
         ],
         isRequired: false,
      } as unknown as ISurveyPayloadSection);

      const key = `section_${sectionIndex}_question`;
      fieldValidation.value[key] = { message: "", pristine: false };
   }

   sectionTimeout.value = setTimeout(() => {
      nextTick(() => {
         const sectionsContainer = document.querySelector(".sections");
         if (sectionsContainer && sectionsContainer.lastElementChild) {
            sectionsContainer.lastElementChild.scrollIntoView({ behavior: "smooth" });
         }
      });
   }, 100);
};

const addOptionToMultipleChoice = (section: ISurveyPayloadSection, sectionIndex: number = 0) => {
   if (section && section.questions![0].typeQuestion === "multiple_choice") {
      const optionIndex = section.questions![0].options!.length;
      section.questions![0].options!.push({ optionName: "" });

      const key = `section_${sectionIndex}_option_${optionIndex}`;
      fieldValidation.value[key] = { message: "", pristine: false };
   }
};

const removeSection = (section: ISurveyPayloadSection) => {
   const sectionIndex = formGroup.value.sections.findIndex((s: ISurveyPayloadSection) => s.id === section.id);
   if (sectionIndex !== -1) {
      const sectionToRemove = formGroup.value.sections[sectionIndex];
      if (sectionToRemove.hasOwnProperty("id")) {
         sectionToRemove.isDelete = true;
         deletedSection.value.push({ ...sectionToRemove });
      }
      formGroup.value.sections = formGroup.value.sections.filter((s: ISurveyPayloadSection) => s.id !== section.id);
   }
};

const removeOption = (sectionId: number | string, questionIndex: number, optionIndex: number) => {
 
   const sectionIndex = formGroup.value.sections.findIndex((s: ISurveyDetailSection) => s.id === sectionId);
   if (sectionIndex !== -1) {
      const section = formGroup.value.sections[sectionIndex];
      if (section && section.questions && section.questions[questionIndex] && section.questions[questionIndex].options) {
         if (section.questions[questionIndex].options.length > 1) {
            section.questions[questionIndex].options.splice(optionIndex, 1);
         } else {
            // Prevent removing the last option if at least one is required
            section.questions[questionIndex].options[0].optionName = "";
         }
      }
   }
};


const removeQuestion = (sectionIndex: number, questionIndex: number, question: ISurveyPayloadQuestion, sectionItem: ISurveyPayloadSection) => {
   if (sectionItem.hasOwnProperty("id")) {
      deletedQuestion.value.push({ ...question, isDelete: true, section_id: Number(sectionItem.id) });
   }
   const section = formGroup.value.sections[sectionIndex];
   if (section && section.questions) {
      section.questions.splice(questionIndex, 1);
   }
};

const handleSendEmailSurvey = (status: boolean) => {
   isDialogSendEmailSurveyOpen.value = status;
};
const dialogSendEmailSurveyCancel = () => {
   isDialogSendEmailSurveyOpen.value = false;
};
const dialogSendEmailSurveyConfirm = (status: boolean, type: string = "") => {
   isDialogSendEmailSurveyOpen.value = status;
   if (type === "refresh") {
      navigateTo("/survey");
   }
};

const openInNewTab = (url: string) => {
   window.open(url, "_blank");
};
</script>

<style scoped lang="scss">
.dashed-line {
   background-image: linear-gradient(to right, #b7a4ce 50%, transparent 50%);
   background-size: 10px 2px;
}
</style>
