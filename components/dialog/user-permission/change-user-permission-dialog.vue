<template>
   <UModal :modelValue="isDialogOpen" :ui="{
      container: 'items-center',
      width: 'w-[400px]',
      rounded: 'rounded-xl',
   }" :initialFocus="removeAutoFocus">
      <div class="p-6">
         <img :src="RefreshIcon" alt="Icon Refresh" class="w-12 h-12 m-auto" />
         <div class="mt-5">
            <div class="text-gray-900 text-lg font-anuphan-semi-bold mb-1">{{ title || "-" }}</div>
            <p class="text-gray-500 text-sm" v-if="desc" v-html="desc"></p>
         </div>
         <UForm class="mt-5" :schema="formSchema" :state="formGroup" @submit="onSubmit">
            <USelect :label="$t('user_permission')" name="roleId" :placeholder="$t('user_permission')"
               v-model="formGroup.roleId" required :options="options" />
            <div class="mt-8 flex justify-between flex-wrap gap-y-3">
               <UButton size="lg" color="white" variant="solid" :label="labelCancel || $t('close')" block
                  class="rounded-lg w-full sm:w-[170px] border border-gray-100 outline-none"
                  @click="dialogCancel(false)" ref="removeAutoFocus" />
               <UButton size="lg" :color="colorConfirm || 'primary'" variant="solid" :label="labelConfirm || 'ตกลง'"
                  block class="rounded-lg w-full sm:w-[170px]" type="submit" />
            </div>
         </UForm>
      </div>
   </UModal>
</template>

<script setup>

import RefreshIcon from "~/assets/icons/dialog/refresh.svg"
import USelect from "~/components/form/u-select.vue";
import { z } from "zod";

const props = defineProps({
   isDialogOpen: Boolean,
   title: String,
   desc: String,
   icon: String,
   labelCancel: String,
   labelConfirm: String,
   dialogCancel: Function,
   dialogConfirm: Function,
   colorConfirm: String,
   roleOptionsNoRoleIdExpectedRemove: {
      type: Array,
      default: []
   }
});

const { t } = useI18n();
const formSchema = z.object({
   roleId: z.number().min(1, { message: t('please_enter_a_value') }),
})
const formGroup = reactive({
   roleId: 0,
})

const options = ref([])

watch(
   () => props.roleOptionsNoRoleIdExpectedRemove,
   (value) => {
      console.log('value', value)
      options.value = value
   }
);


const removeAutoFocus = ref(null);

async function onSubmit(event) {
   props.dialogConfirm(event.data.roleId)
}
</script>
