<template>
  <UButton
    color="white"
    variant="solid"
    label="เลือกไฟล์"
    block
    class="rounded-lg w-full h-10 border border-gray-100 text-base sm:w-[140px] "
    @click="action"
  >
    <template #leading>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="16" fill="#F26522" />
        <g clip-path="url(#clip0_379_28310)">
          <path
            d="M21.4927 9.97466L19.9194 8.40132C19.6593 8.13979 19.3499 7.93243 19.0091 7.79125C18.6684 7.65008 18.303 7.57789 17.9341 7.57887H11.7889C11.2305 7.57887 10.695 7.80067 10.3002 8.19548C9.9054 8.5903 9.68359 9.12578 9.68359 9.68413V24.421H22.3152V11.9592C22.3133 11.2151 22.0177 10.5019 21.4927 9.97466ZM20.5004 10.9669C20.5357 11.0052 20.5688 11.0455 20.5994 11.0876H18.8064V9.29466C18.8485 9.32528 18.8888 9.35832 18.9271 9.3936L20.5004 10.9669ZM11.0871 23.0175V9.68413C11.0871 9.49801 11.161 9.31952 11.2926 9.18791C11.4242 9.05631 11.6027 8.98238 11.7889 8.98238H17.4029V12.4911H20.9117V23.0175H11.0871ZM12.4906 18.8069H19.5082V14.5964H12.4906V18.8069ZM13.8941 15.9999H18.1046V17.4034H13.8941V15.9999ZM12.4906 20.2104H19.5082V21.614H12.4906V20.2104Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_379_28310">
            <rect
              width="16.8421"
              height="16.8421"
              fill="white"
              transform="translate(7.57812 7.57898)"
            />
          </clipPath>
        </defs>
      </svg>
    </template>
  </UButton>
</template>
<script setup>
defineProps({
  action: Function,
});
</script>
