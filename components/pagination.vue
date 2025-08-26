<template>
   <UPagination
      v-model="page"
      :total="total"
      :ui="{
         default: {
            activeButton: {
               variant: 'ghost',
               class: 'min-w-9 h-9 rounded-full [&_span]:w-full bg-primary-500 text-white hover:bg-primary-500',
            },
            inactiveButton: {
               color: 'white',
               variant: 'ghost',
               class: 'w-9 h-9 rounded-lg [&_span]:w-full text-gray-500 hover:bg-transparent text-black',
            },
         },
      }"
      class="justify-center gap-x-2"
      @click="changePage(page)"
   >
      <template #prev="{ onClick }">
         <UButton
            @click="onClick"
            icon="i-heroicons-chevron-left"
            size="xs"
            color="black"
            square
            variant="link"
            class="!ml-2 scale-x-[-1] disabled:opacity-30"
            :disabled="page == 1"
         >
            <template #leading>
               <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.98438 0L7.98438 6L1.98438 12L0.578125 10.5938L5.17188 6L0.578125 1.40625L1.98438 0Z" fill="black" fill-opacity="0.87" />
               </svg>
            </template>
         </UButton>
      </template>
      <template #next="{ onClick }">
         <UButton @click="onClick" size="xs" color="black" square variant="link" class="!ml-1 disabled:opacity-30" :disabled="Math.ceil(total / limit) == page">
            <template #leading>
               <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.98438 0L7.98438 6L1.98438 12L0.578125 10.5938L5.17188 6L0.578125 1.40625L1.98438 0Z" fill="black" fill-opacity="0.87" />
               </svg>
            </template>
         </UButton>
      </template>
   </UPagination>
</template>
<script setup>
const props = defineProps({
   currentPage: Number,
   total: Number,
   changePage: Function,
   limit: Number,
});

const page = ref(props.currentPage);
watch(
   () => props.currentPage,
   (newValue) => {
      page.value = newValue;
   }
);
</script>
