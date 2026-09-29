import React from 'react';
import {Image} from 'react-native-elements';
import {BackgroundImage, LogoImg} from '../assets';
import LinearGradient from 'react-native-linear-gradient';
import PText from '../components/PText';
import {StatusBar, StyleSheet, View} from 'react-native';
import i18n from '../../i18n';
import {Theme} from '../theme/ThemeProvider';
interface LoginHeaderProps {
  theme: Theme;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({theme}) => {
  const styles = generateStyles(theme);

  return (
    <>
      <StatusBar hidden={true} />
      <Image source={BackgroundImage} style={styles.semiCircle} />
      <LinearGradient
        colors={[
          'rgba(67, 26, 122, 0.97)',
          'rgba(166, 128, 234, 0)',
        ]}></LinearGradient>
      <View style={styles.overlay}>
        <View style={styles.oval}>
          <Image source={LogoImg} style={styles.logo} resizeMode="cover" />
        </View>
      </View>
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
      width: 140,
      height: 135,
      marginLeft: 5,
      alignSelf: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Position the overlay view absolutely
      justifyContent: 'flex-end', // Align content at the bottom
      position: 'absolute',
      marginTop: '50%',
      alignItems: 'center',
      alignSelf: 'center',
      marginLeft: '5%',
    },
    oval: {
      width: '45%',
      height: '30%',
      borderRadius: 25, // Half of the height (to create a circle)
      alignSelf: 'center', // Center the oval horizontally
      justifyContent: 'center',
    },
    semiCircle: {
      width: '100%',
      height: 250,
      borderBottomLeftRadius: 200,
      borderBottomRightRadius: 200,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      transform: [{scaleX: 1.5}],
    },
    title1: {
      marginTop: '10%',
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
export default LoginHeader;
