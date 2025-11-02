import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from './locales/en/translation.json';
import translationUk from './locales/uk/translation.json';
import translationPl from './locales/pl/translation.json';
import translationHu from './locales/hu/translation.json';
import translationRo from './locales/ro/translation.json';
import translationBg from './locales/bg/translation.json';

const resources = {
    'en-US': { translation: translationEn },
    'uk-UA': { translation: translationUk },
    'pl-PL': { translation: translationPl },
    'hu-HU': { translation: translationHu },
    'ro-RO': { translation: translationRo },
    'bg-BG': { translation: translationBg },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.locale;
    }

    i18n.use(initReactI18next).init({
        compatibilityJSON: "v3",
        resources,
        lng: savedLanguage,
        fallbackLng: "pt-BR",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
