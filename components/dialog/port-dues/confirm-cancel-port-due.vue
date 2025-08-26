<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }" :initialFocus="removeAutoFocus">
      <div class="p-6">
         <img :src="WarningIcon" alt="Icon Warning" class="w-12 h-12" />
         <div :class="[`${descriptionWrapperClass}`]" class=" mt-5">
            <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">{{ $t('cancel_invoice') }}</div>
            <p class="text-gray-500 text-sm">{{ $t('cancel_invoice_dialog_description') }}</p>
         </div>

         <UForm :state="formGroup">
            <div class="mt-4">
               <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
                  <div class="col-span-2">
                     <UTextarea :label="$t('detail')" :placeholder="$t('detail')" v-model="formGroup.note" />
                  </div>
               </div>
            </div>
         </UForm>

         <div :class="[`${buttonWrapperClass}`]" class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton size="lg" color="white" variant="solid" :label="labelCancel || $t('close')" block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none" @click="dialogCancel(false)"
               ref="removeAutoFocus" />
            <UButton size="lg" :color="colorConfirm || 'primary'" variant="solid" :label="labelConfirm || 'ตกลง'" block
               class="rounded-lg w-full sm:w-[170px]" @click="dialogConfirm" :disabled="!formGroup.note.trim()" />
         </div>
      </div>
   </UModal>
</template>

<script setup lang="ts">
import WarningIcon from "~/assets/icons/dialog/warning.png";
import UTextarea from "~/components/form/u-textarea.vue";

defineProps({
   formGroup: Object,
   isDialogOpen: Boolean,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   colorConfirm: String,
   buttonWrapperClass: String,
   descriptionWrapperClass: String
});

const removeAutoFocus = ref(null);
</script>
