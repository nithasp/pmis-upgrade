import en from "~/assets/locales/en/index";
import th from "~/assets/locales/th/index";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "th",
  messages: {
    en: en,
    th: th,
  },
}));
