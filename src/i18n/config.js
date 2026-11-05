import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const loaders = {
  vi: () => import("./locales/vi/translation.json"),
  en: () => import("./locales/en/translation.json"),
};
const loaded = new Set();

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(Object.keys(loaders).map((code) => [code, { translation: {} }])),
  lng: "vi",
  fallbackLng: "vi",
  supportedLngs: Object.keys(loaders),
  interpolation: { escapeValue: false },
});

export async function ensureTranslations(language = i18n.language) {
  const code = loaders[language] ? language : "vi";
  if (loaded.has(code)) return;
  const bundle = await loaders[code]();
  i18n.addResourceBundle(code, "translation", bundle.default, true, true);
  loaded.add(code);
}

export default i18n;
