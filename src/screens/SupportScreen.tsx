import React from 'react';
import {
  ImageBackground,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import PText from '../components/PText';
import {Theme, useTheme} from '../theme/ThemeProvider';
import i18n from '../../i18n';
import {customerSuppportImg} from '../assets';

const SupportScreen = () => {
  const theme = useTheme();
  const styles = genereateStyles(theme);
  const handleOpenEmail = () => {
    const emailUri = 'mailto:grievances.tutycorp@gmail.com';
    Linking.openURL(emailUri);
  };
  return (
    <View>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <ImageBackground
        source={customerSuppportImg}
        style={styles.img}></ImageBackground>
      <PText style={styles.saveBtn} theme={theme} onPress={handleOpenEmail}>
        {i18n.t('send_email')}
      </PText>
    </View>
  );
};
const genereateStyles = (theme: Theme) =>
  StyleSheet.create({
    img: {
      width: '95%',
      height: '75%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20%',
      marginLeft: 10,
      marginRight: 10,
    },
    container: {
      margin: 10,
      backgroundColor: theme.colors.cream,
    },
    saveBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.whitecolor,
      textAlign: 'center',
      marginLeft: '5%',
      marginRight: '5%',
      marginBottom: '5%',
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 5,
      fontSize: theme.fontSizes.thick,
      fontFamily: theme.fonts.bold,
    },
  });

export default SupportScreen;
