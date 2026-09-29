import {I18n} from 'i18n-js';
import translations from './translations.json';

const i18n = new I18n(translations);
export const changeLanguage = (language: string) => {
  i18n.locale = language;
};
export default i18n;
