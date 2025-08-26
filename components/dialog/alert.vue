<template>
   <UModal :modelValue="isOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }">
      <div class="p-6 text-center">
         <img v-if="type === 'success'" :src="ConfirmIcon" alt="Icon Confirm" class="w-12 h-12 m-auto" />
         <img v-else-if="type === 'danger'" :src="DangerIcon" alt="Icon Danger" class="w-12 h-12 m-auto" />
         <img v-else-if="type === 'warning'" :src="WarningIcon" alt="Icon Warning" class="w-12 h-12 m-auto" />
         <div class="text-center mt-5">
            <p class="text-lg text-gray-900 font-anuphan-semi-bold mb-2">{{ title || "-" }}</p>
            <p class="text-sm text-gray-600" v-if="desc">{{ desc }}</p>
         </div>

         <!-- <div class="mt-8" v-if="type === 'success'">
            <ButtonWhite :text="btnName || 'ตกลง'" @click="setDialog(false)" class="w-full" size="lg" />
         </div>
         <div class="mt-8" v-else>
            <ButtonPrimary :text="btnName || 'ตกลง'" @click="setDialog(false)" class="w-full" size="lg" />
         </div> -->
         <!-- <div class="mt-8">
            <ButtonWhite :text="btnName || $t('ok')" @click="setDialog(false)" class="w-full" size="lg" />
         </div> -->
         <div class="mt-8">
            <UButton size="lg" color="white" variant="solid" :label="btnName || $t('confirm')" block
               class="rounded-lg w-full border border-gray-100 outline-none" @click="setDialog(false)" />
         </div>
      </div>
   </UModal>
</template>

<script setup>
import WarningIcon from "~/assets/icons/dialog/warning.png";
import ConfirmIcon from "~/assets/icons/dialog/confirm.png";
import DangerIcon from "~/assets/icons/dialog/danger.png";

defineProps({
   isOpen: Boolean,
   setDialog: Function,
   title: String,
   desc: String,
   btnName: String,
   type: String,
   btnAction: Function,
});
</script>
