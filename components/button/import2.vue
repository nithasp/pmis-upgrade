<template>
   <UDropdown
      :items="items"
      :popper="{ placement: 'bottom-start' }"
      :ui="{
         ring: 'ring-gray-50',
         divide: 'divide-gray-100',
         item: {
            active: 'bg-gray-50',
         },
      }"
   >
      <template #item="{ item }">
         <ImportIcon v-if="item.id === 'import'" />
         <DownloadIcon v-if="item.id === 'download'" />
         <span class="truncate">{{ item.label }}</span>
      </template>
      <UButton color="primary" variant="outline" label="นำเข้าข้อมูล" block class="rounded-lg h-10 w-[140px]">
         <template #leading>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 22 20" fill="none">
               <g clip-path="url(#clip0_477_35478)">
                  <path
                     d="M9.30753 10.1539C9.13841 10.3437 9.05385 10.5714 9.05385 10.837C9.05385 11.1027 9.13841 11.3304 9.30753 11.5201C9.47665 11.7099 9.6796 11.8048 9.91636 11.8048C10.1531 11.8048 10.3561 11.7099 10.5252 11.5201L13.2819 8.42716C13.6201 8.04766 13.6201 7.44045 13.2819 7.06095L10.5252 3.96798C10.187 3.58847 9.64577 3.58847 9.30753 3.96798C8.96929 4.34748 8.96929 4.95469 9.30753 5.3342L10.6098 6.79529H2.60938V8.71179H10.6098L9.30753 10.1729V10.1539Z"
                     fill="#F26522"
                  />
                  <path
                     d="M18.4991 0.0737915H8.46461C6.53352 0.0737915 4.96338 1.71612 4.96338 3.7194V5.13778H6.76814V3.7194C6.76814 2.70874 7.52614 1.87855 8.46461 1.87855H18.4991C19.4375 1.87855 20.1955 2.70874 20.1955 3.7194V16.2805C20.1955 17.2912 19.4375 18.1214 18.4991 18.1214H13.0848V15.5767C13.0848 13.9885 11.8034 12.7071 10.2152 12.7071H6.76814V10.2887H4.96338V16.2805C4.96338 18.2838 6.53352 19.9261 8.46461 19.9261H18.4991C20.4302 19.9261 22.0003 18.2838 22.0003 16.2805V3.7194C22.0003 1.71612 20.4302 0.0737915 18.4991 0.0737915ZM6.76814 16.2805V14.5119H10.2152C10.7927 14.5119 11.28 14.9811 11.28 15.5767V18.1214H8.46461C7.52614 18.1214 6.76814 17.2912 6.76814 16.2805Z"
                     fill="#F26522"
                  />
               </g>
               <defs>
                  <clipPath id="clip0_477_35478">
                     <rect width="22" height="19.8523" fill="white" transform="translate(0 0.073822)" />
                  </clipPath>
               </defs>
            </svg>
         </template>
      </UButton>
   </UDropdown>
</template>

<script setup>
import DownloadIcon from "~/assets/icons/download";
import ImportIcon from "~/assets/icons/import";

const props = defineProps({
   items: Array,
});
</script>
