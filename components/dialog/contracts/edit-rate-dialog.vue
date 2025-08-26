<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }" :initialFocus="removeAutoFocus">
      <div class="p-6">
         <img :src="BookIcon" class="w-12 h-12" />
         <div :class="[`${descriptionWrapperClass}`]" class=" mt-5">
            <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">{{ $t('แก้ไขอัตราสินค้าผ่านท่า') }}</div>
            <p class="text-gray-500 text-sm">{{ $t('ระบุอัตราสินค้าผ่านท่า') }}</p>
         </div>

         <UForm :state="formGroup" >
            <div class="mt-4">
               <div class="grid grid-cols-[1fr_1fr] gap-y-4 gap-x-6">
                  <div class="col-span-2">
                     <NumericInput :label="$t('อัตรา')" placeholder="0.000" name="rate" required :decimalPlaces="3"
                        v-model="formGroup.annualRates[index].rate" 
                        :value="formGroup.annualRates[index].rate" />
                  </div>
               </div>
            </div>
         </UForm>

         <div :class="[`${buttonWrapperClass}`]" class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton size="lg" color="white" variant="solid" :label="labelCancel || $t('close')" block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none" @click="dialogCancel(false)"
               ref="removeAutoFocus" />
            <UButton size="lg" :color="colorConfirm || 'primary'" variant="solid" :label="labelConfirm || 'ตกลง'" block
               class="rounded-lg w-full sm:w-[170px]" @click="dialogConfirm"  />
         </div>
      </div>
   </UModal>
</template>

<script setup lang="ts">

import BookIcon from "~/assets/icons/dialog/book.png";
import NumericInput from "~/components/form/u-numeric-input.vue";

const removeAutoFocus = ref(null);

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
   descriptionWrapperClass: String,
   index: {
      type: Number,
      default: 0
   },
});

</script>
