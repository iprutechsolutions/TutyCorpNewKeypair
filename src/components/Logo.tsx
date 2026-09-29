import {View, Image, StyleSheet} from 'react-native';
import styles from 'toastify-react-native/components/styles';
import i18n from '../../i18n';
import {LogoImg} from '../assets';
import theme from '../theme/theme';
import PText from './PText';
import React from 'react';
import {Theme} from '../theme/ThemeProvider';

const Logo = () => {
  const styles = generateStyles(theme);
  return (
    <>
      <Image source={LogoImg} style={styles.logo} resizeMode="cover" />
      <PText style={styles.title1} theme={theme}>
        {i18n.t('welcometo')}
      </PText>
      <PText style={styles.title2} theme={theme}>
        {i18n.t('thoothukudi_corp')}
      </PText>
    </>
  );
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    logo: {
      width: '40%',
      height: '30%',
      alignSelf: 'center',
    },

    title1: {
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.thick,
    },
    title2: {
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.thick,
    },
  });
export default Logo;
