<template>
  <div class="w-full py-6">
    <div :class="direction === 'horizontal' ? 'flex' : 'flex flex-col items-start'">
      <div v-for="(step, index) in steps" :key="index"
        :class="direction === 'horizontal' ? 'w-1/3' : 'w-full flex items-start mb-16'">
        <!-- Step Indicator -->
        <div class="relative mb-2" :class="direction === 'horizontal' ? '' : 'flex flex-col items-center'">
          <!-- Connector line -->
          <div v-if="index > 0" :class="direction === 'horizontal'
            ? 'absolute flex align-center items-center align-middle content-center'
            : 'absolute w-[2px]'" :style="direction === 'horizontal'
              ? { width: 'calc(100% - 2rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }
              : { height: 'calc(100% - -2rem)', top: '-178%', left: '50%' }">
            <div
              :class="direction === 'horizontal' ? 'w-full bg-[#D0D5DD] rounded items-center align-middle align-center flex-1' : 'h-full rounded items-center align-middle align-center flex-1'"
              :style="{ backgroundColor: currentStep >= index ? '#704a9e' : '#D0D5DD' }"> <!-- Adjust the color here -->
              <div :class="direction === 'horizontal' ? 'bg-primaryy-500 rounded' : ''" :style="direction === 'horizontal'
                ? { width: `${currentStep >= index ? 100 : 0}%`, padding_bottom: '1px', paddingTop: '1px' }
                : { height: `${currentStep >= index ? 100 : 0}%`, width: '100%' }">
              </div>
            </div>
          </div>

          <div :class="[
            'w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center',
            renderStepStyle(currentStep, index)
          ]">
            <div class="text-center w-full justify-center flex items-center">
              <div v-if="currentStep === index" class="w-[12px] h-[12px] rounded-full bg-primaryy-500"></div>
              <div v-if="currentStep > index" class="text-white flex justify-center items-center">
                <UIcon name="i-heroicons-check-solid" class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Step Label -->
        <div
          :class="direction === 'horizontal' ? 'text-xs text-center md:text-base font-bold' : 'ml-4 flex flex-col justify-center'">
          <div class="text-xs md:text-base font-bold">
            {{ step.label }}
          </div>
          <div class="text-xs md:text-base text-grayy-75">
            {{ step.detail }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _bottom } from '#tailwind-config/theme/backgroundPosition';

const props = defineProps({
  currentStep: Number,
  steps: Array,
  direction: {
    type: String,
    default: 'horizontal', // Default layout
    validator: value => ['horizontal', 'vertical'].includes(value),
  },
});

const renderStepStyle = (currentStep, index) => {
  if (currentStep === index) {
    return 'border-2 border-primaryy-500 text-white'
  } else if (currentStep > index) {
    return 'bg-primaryy-500'
  } else {
    return 'bg-white border-2 border-gray-200 text-gray-600'
  }
};
</script>

<style scoped>
/* Optional: Additional styling if needed */
</style>
