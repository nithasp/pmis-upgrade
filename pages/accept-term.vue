<template>
   <main class="relative h-screen bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center">
      <div class="lang absolute top-4 right-4 flex gap-1">
         <ToggleLanguage />
      </div>
      <div class="h-screen flex items-center justify-center">
         <div class="w-1/2">
            <div class="rounded-[20px] bg-white m-auto p-[55px_27px] max-w-[450px]">
               <div class="text-center flex flex-col items-center">
                  <img :src="Logo" alt="SWU Logo" class="w-[48px]" />
                  <h1 class="font-anuphan-semi-bold text-[24px] my-6">{{ $t('terms_and_conditions') }}</h1>
                  <p class="mb-10">{{ $t('last_updated') }} {{ termsData.createAt &&
                     renderDateFormatTH(termsData.createAt) }}
                  </p>
                  <div ref="termRef" @scroll="handleScroll" v-html="termsData.content"
                     class="border-[#9477B6] p-5 border rounded-[20px] w-full h-[266px] overflow-auto">
                  </div>
               </div>
               <Checkbox :disabled="disabledAcceptTerm" class="mt-[24px]" name="notifications"
                  :label="$t('agree_accept_term')" :modelValue="isAcceptTermCheck"
                  @update:modelValue="isAcceptTermCheck = $event" />
               <UButton :disabled="!isAcceptTermCheck" size="xl" variant="solid" :label="$t('ok')" block
                  class="rounded-lg mt-6 " type="submit" @click="handleClickAcceptTerm" />
            </div>
         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
import Loading from "~/components/loading.vue";

import Logo from "~/assets/images/logo-mini.png";
import Checkbox from "~/components/form/checkbox.vue";


definePageMeta({
   layout: false,
});
const isLoading = ref(false);

import ToggleLanguage from "~/components/ui/toggleLanguage.vue";
import useMasterDataService from "~/core/services/masterDataService";
import useAuthService from "~/core/services/authService";

const masterDataService = useMasterDataService()
const authService = useAuthService()
const authStore = useAuthStore()
const disabledAcceptTerm = ref(true)
const isAcceptTermCheck = ref(false)
const termRef = ref(null)
const termsData = ref({
   content: '',
   createAt: '',
   id: 0,
   version: ''
})

onMounted(() => {
   getTermsAndContent()
})

const getTermsAndContent = async () => {
   const resp = await masterDataService.getTermsContent()
   if (resp.statusCode === 200) {
      termsData.value = resp.data
   }
}

const handleScroll = () => {
   if (termRef.value) {
      const termsDiv: any = termRef.value;
      const bottomReached =
         termsDiv.scrollHeight - termsDiv.scrollTop <= (termsDiv.clientHeight + 3);

      if (bottomReached) {
         disabledAcceptTerm.value = false;
      }
   }
}

const handleClickAcceptTerm = async () => {
   isLoading.value = true
   const resp = await authService.acceptForTermAndCondition()
   if (resp.statusCode === 200) {
      const res = await authService.getUserData()
      if (res.statusCode === 200) {
         authStore.profileUser = res.data
         navigateTo('/main')
      }
   }
   isLoading.value = false
}

</script>
