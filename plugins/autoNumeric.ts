import { defineNuxtPlugin } from '#app';
import autoNumericDirective from '@/directives/autoNumeric';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('auto-numeric', autoNumericDirective);
});
