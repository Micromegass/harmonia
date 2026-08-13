import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./es.json";
import en from "./en.json";
import { defaultLocale, type Locale } from "./routing";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

/** Synchronously align i18next with the locale in the URL (prerender + hydration safe). */
export function syncLocale(locale: Locale) {
  if (i18n.language !== locale) i18n.changeLanguage(locale);
}

export default i18n;
