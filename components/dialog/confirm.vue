<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }" :initialFocus="removeAutoFocus">
      <div class="p-6 text-center">
         <img v-if="icon === 'warning'" :src="WarningIcon" alt="Icon Warning" class="w-12 h-12 m-auto" />
         <img v-else-if="icon === 'success'" :src="ConfirmIcon" alt="Icon Confirm" class="w-12 h-12 m-auto" />
         <img v-else-if="icon === 'danger'" :src="DangerIcon" alt="Icon Danger" class="w-12 h-12 m-auto" />
         <img v-else-if="icon === 'refresh'" :src="RefreshIcon" alt="Icon Refresh" class="w-12 h-12 m-auto" />
         <div :class="[`${descriptionWrapperClass}`]" class="text-center mt-5">
            <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">{{ title || "-" }}</div>
            <p class="text-gray-500 text-sm" v-if="desc" v-html="desc"></p>
         </div>
         <div v-if="$slots.customNodeContent">
            <slot name="customNodeContent"></slot>
         </div>
         <div :class="[`${buttonWrapperClass}`]" class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton :disabled="disabledCancel" size="lg" color="white" variant="solid"
               :label="labelCancel || $t('close')" block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none" @click="dialogCancel(false)"
               ref="removeAutoFocus" />
            <UButton :disabled="disabledConfirm" size="lg" :color="colorConfirm || 'primary'" variant="solid"
               :label="labelConfirm || 'ตกลง'" block class="rounded-lg w-full sm:w-[170px]" @click="dialogConfirm" />
         </div>
      </div>
   </UModal>
</template>

<script setup>
import WarningIcon from "~/assets/icons/dialog/warning.png";
import ConfirmIcon from "~/assets/icons/dialog/confirm.png";
import DangerIcon from "~/assets/icons/dialog/danger.png";
import RefreshIcon from "~/assets/icons/dialog/refresh.svg"

defineProps({
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
   disabledConfirm: Boolean,
   disabledCancel: Boolean,
});

const removeAutoFocus = ref(null);
</script>
