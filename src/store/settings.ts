import AsyncStorage from '@react-native-async-storage/async-storage';
const LANGUAGE: string = 'lang';
export const storePreferedLang = async (
  lang: string,
): Promise<string | null> => {
  try {
    await AsyncStorage.setItem(LANGUAGE, lang);
    return lang;
  } catch (error) {
    console.error('Error storing user into AsyncStorage:', error);
    throw error;
  }
};

export const getPreferedLang = async (): Promise<string> => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE);
    if (!lang) {
      return 'en';
    }
    return lang;
  } catch (error) {
    console.error('Error reading user from AsyncStorage:', error);
    throw error;
  }
};
