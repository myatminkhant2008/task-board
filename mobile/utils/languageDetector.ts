import { ModuleType } from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORE_LANGUAGE_KEY = "task-board-language" 
const languageDetectorPlugin = {
    type: "languageDetector" as ModuleType,
    async: true,
    init: () => {},
    detect: async function(callback: (lang : string) => void) {
        const defaultLang = "en";
        try {
            const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
            if(language) {
                return callback(language)
            }
            else {
                return callback(defaultLang)
            }
        }
        catch(error) {
            console.error("Error: ",error)
        }
    },
    cacheUserLanguage: async function(language : string) {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY,language)
        }
        catch(error) {
            console.error("Error: ",error)
        }
    }
};

export default languageDetectorPlugin;