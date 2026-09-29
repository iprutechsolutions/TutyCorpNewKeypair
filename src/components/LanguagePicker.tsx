import {Picker} from '@react-native-picker/picker';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme} from '../theme/ThemeProvider';
import i18n, {changeLanguage} from '../../i18n';
import {getPreferedLang, storePreferedLang} from '../store/settings';
import PText from './PText';
import {AuthContext} from '../store/auth-context';

interface LanguagePros {
  theme: Theme;
}

const LanguagePicker: React.FC<LanguagePros> = ({theme}) => {
  const authCtx = useContext(AuthContext);
  const [language, selectLanguage] = useState('English');
  const langs: string[] = ['English', 'தமிழ்'];
  const styles = generateStyle(theme);
  const renderLanguages = () => {
    return langs?.map(item => (
      <Picker.Item style={styles.text} key={item} label={item} value={item} />
    ));
  };
  useEffect(() => {
    (async () => {
      const lang = await getPreferedLang();
      const language = lang === 'en' ? 'English' : 'தமிழ்';
      selectLanguage(language);
    })();
  }, []);
  return (
    <View>
      <PText style={styles.lan} theme={theme}>
        {i18n.t('selectlanguage')}
      </PText>
      <Picker
        itemStyle={{backgroundColor: 'white'}}
        style={styles.picker}
        selectedValue={language}
        onValueChange={(itemValue: string) => {
          selectLanguage(itemValue);

          if (itemValue === 'English') {
            changeLanguage('en');
            storePreferedLang('en');
            authCtx.authenticate({...authCtx.user, language: 'en'});
          } else {
            changeLanguage('ta-In');
            storePreferedLang('ta-In');
            authCtx.authenticate({...authCtx.user, language: 'ta-In'});
          }
        }}>
        {renderLanguages()}
      </Picker>
    </View>
  );
};
const generateStyle = (theme: Theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.primary,
      textAlign: 'left',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    picker: {
      width: '45%',
      borderRadius: 8,
    },
    lan: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.thin,
      fontWeight: '600',
      textAlign: 'left',
      marginTop: '5%',
    },
  });
export default LanguagePicker;
