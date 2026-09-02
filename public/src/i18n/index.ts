import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'
import de from './locales/de.json'
import tr from './locales/tr.json'

const STORAGE_KEY = 'loom:language'

function getInitialLang(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && ['en', 'ar', 'de', 'tr'].includes(stored)) return stored
  } catch {
    /* ignore storage errors */
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    de: { translation: de },
    tr: { translation: tr },
  },
  lng: getInitialLang(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore storage errors */
  }
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

const currentLang = i18n.language
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = currentLang

export default i18n
