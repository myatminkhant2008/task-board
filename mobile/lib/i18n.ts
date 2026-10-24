import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import enJson from "../locales/en.json"
import mmJson from "../locales/mm.json"
import languageDetectorPlugin from "../utils/languageDetector"

const resources = {
    en: {
        translation: enJson
    },
    mm: {
        translation: mmJson
    }
}

i18n
.use(initReactI18next)
.use(languageDetectorPlugin)
.init({
    resources,
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }

})

export default i18n;