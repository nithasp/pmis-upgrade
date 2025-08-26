import ColorsCustom from "./utils/color.json";

/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
      "./node_modules/vue-tailwind-datepicker/**/*.js",
   ],
   theme: {
      extend: {
         fontFamily: {
            'anuphan': ["anuphan", "sans-serif"],
            'anuphan-bold': ["anuphan-bold", "sans-serif"],
            'anuphan-semi-bold': ["anuphan-semi-bold", "sans-serif"],
            'anuphan-medium': ["anuphan-medium", "sans-serif"],
            // Anuphan: ["Anuphan", "sans-serif"],
            // AnuphanBold: ["AnuphanBold", "sans-serif"],
            // AnuphanSemiBold: ["anuphan-semi-bold", "sans-serif"],
            // AnuphanMedium: ["AnuphanMedium", "sans-serif"],
         },
         colors: {
            grayy: ColorsCustom.gray,
            primaryy: ColorsCustom.primary,
            error: ColorsCustom.error,
            warning: ColorsCustom.warning,
            success: ColorsCustom.success,
            purple: ColorsCustom.purple,
            brand: ColorsCustom.brand
         },
         screens: {
            mobile: "400px",
            xs: "576px",
            sm: "640px",
            md: "768px",
            tablet: "850px",
            lg: "1024px",
            xl: "1280px",
            fhd: "1920px",
         },
      },
   },
   plugins: [],
};
