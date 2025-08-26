<template>
  <div class="flex items-center justify-center space-x-4 z-10">
    <div class="relative flex items-center">
      <input type="checkbox" id="toggle" class="sr-only" v-model="isChecked" />
      <label for="toggle" class="flex items-center cursor-pointer rounded-full border-gray-300 bg-white">
        <div class="flex items-center space-x-1 p-[3px]">
          <div :class="[
            'rounded-full transition-all duration-300 w-[36px] h-[36px] flex justify-center items-center',
            isChecked ? 'text-gray-600' : 'bg-primaryy-500 text-white'
          ]">
            TH
          </div>
          <div :class="[
            'rounded-full transition-all duration-300 w-[36px] h-[36px] flex justify-center items-center',
            isChecked ? 'bg-primaryy-500 text-white' : 'text-gray-600'
          ]">
            EN
          </div>
        </div>
        <div
          class="absolute w-1/2 h-full opacity-0 bg-primaryy-500 rounded-full transition-transform duration-300 ease-in-out"
          :style="{ transform: isChecked ? 'translateX(100%)' : 'translateX(0%)' }"></div>
      </label>
    </div>
  </div>
</template>

<script setup>

const lang = localStorage.getItem('lang') || ''
const isChecked = ref(lang === 'en' ? true : false);

const { locale, setLocale } = useI18n();

watch(isChecked, (newValue) => {
  const lang = newValue ? 'en' : 'th'
  setLocale(lang)
  localStorage.setItem('lang', lang)
});

</script>
