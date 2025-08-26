<template>
   <div class="h-screen bg-[#0009] w-screen absolute top-0 left-0 z-[999999]">
      <img :src="Loading" alt="" class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
   </div>
</template>
<script setup>
import Loading from "~/assets/images/loading.svg";
</script>
