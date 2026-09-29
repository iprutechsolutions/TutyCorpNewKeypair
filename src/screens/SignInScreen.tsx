import React from 'react';
import {Linking, StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import PButton from '../components/PButton';
import i18n, {changeLanguage} from '../../i18n';
import LoginHeader from '../components/LoginHeader';
import {useNavigation} from '@react-navigation/native';
import PText from '../components/PText';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {storePreferedLang} from '../store/settings';

const SignInScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = generateStyles(theme);
  return (
    <GestureHandlerRootView>
      <View style={styles.root}>
        <View style={styles.container}>
          <LoginHeader theme={theme} />
          <PText style={styles.message} theme={theme}>
            {i18n.t('login_msg')}
          </PText>
          <PButton
            theme={theme}
            title={i18n.t('login')}
            textStyle={styles.loginBtnTxt}
            onPress={async () => {
              await storePreferedLang('en');
              await changeLanguage('en');
              navigation.navigate('OTPScreen', {isStaff: false});
            }}></PButton>
          <PButton
            theme={theme}
            title={i18n.t('staff_login')}
            textStyle={styles.staffBtnTxt}
            style={styles.staffBtn}
            onPress={() => {
              navigation.navigate('OTPScreen', {isStaff: true});
            }}></PButton>
          <PButton
            theme={theme}
            title={i18n.t('e_pay')}
            textStyle={styles.staffBtnTxt}
            style={styles.staffBtn}
            onPress={() => {
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.cma_mobile.beta',
              );
            }}></PButton>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.colors.whitecolor,
    },
    container: {
      width: '100%',
      height: 250,
    },
    loginBtnTxt: {
      color: theme.colors.whitecolor,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.bold,
    },
    staffBtn: {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    staffBtnTxt: {
      color: theme.colors.textcolor,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.bold,
    },
    message: {
      textAlign: 'center',
      margin: '1%',
      color: theme.colors.msgcolor,
    },
  });

export default SignInScreen;
