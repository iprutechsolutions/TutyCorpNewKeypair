// i18n.d.ts
declare module 'i18n-js' {
  import {Locale} from 'react-native-localize';

  interface I18n {
    locale: Locale;
    fallbacks: boolean;
    translations: {[key: string]: object};
    // Add other properties and methods used in your application
  }

  const i18n: I18n;

  export default i18n;
}
