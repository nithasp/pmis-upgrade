<template>
    <div id="survey-success" class="mx-auto my-0 mobile:px-4">
      <div class="inner">
        <header class="shadow-md rounded-xl bg-white p-6">
          <div class="header-content flex flex-col md:flex-row items-center justify-center md:justify-start 
                      bg-[url('~/assets/images/survey/survey-header-bg.jpg')] bg-cover bg-center 
                      min-h-[200px] md:min-h-[268px] pl-4 md:pl-10 border border-solid rounded-2xl 
                      border-[#704A9E] bg-[#704a9e]">
            <div class="text-center md:text-left">
              <div class="font-anuphan-bold text-2xl xs:text-3xl md:text-5xl text-white mb-2 md:mb-4">
                ขอบคุณสำหรับการทำแบบสอบถาม
              </div>
              <div class="font-anuphan-medium text-lg xs:text-xl md:text-[30px] text-white">
                เราได้บันทึกคำตอบของคุณไว้แล้ว
              </div>
            </div>
          </div>
        </header>
        <p class="text-lg md:text-xl text-[#8C8C8C] text-center mt-6 md:mt-[30px]">
          การนิคมอุตสาหกรรมแห่งประเทศไทย
        </p>
        <div class="mt-4">
          <img :src="PmisLogo" alt="ship-variant-icon" class="w-32 md:w-[163px] h-auto mx-auto" />
        </div>
      </div>
    </div>
  </template>
  

<script setup lang="ts">
import PmisLogo from "~/assets/images/logo.png";
</script>