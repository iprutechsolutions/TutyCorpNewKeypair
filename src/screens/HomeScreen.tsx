import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import PText from '../components/PText';
import {useNavigation} from '@react-navigation/native';
import i18n from '../../i18n';
import LanguagePicker from '../components/LanguagePicker';
import {AuthContext} from '../store/auth-context';
import Logo from '../components/Logo';
import DashboardOptions from '../components/DashboardOptions';
import {useIsFocused} from '@react-navigation/native';
import {getUserFromStorage} from '../store/user';

const HomeScreen = () => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  let authCtx = useContext(AuthContext);

  const [username, setUsername] = useState(authCtx.username);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const userObj = await getUserFromStorage();
      setUsername(userObj?.username);
    })();
  }, [isFocused]);
  const styles = generateStyles(theme);

  return (
    <>
      <StatusBar backgroundColor={theme.colors.cream} barStyle="dark-content" />
      <View style={styles.root}>
        <LanguagePicker theme={theme} />
        {authCtx.username && (
          <PText style={styles.profileName} theme={theme}>
            {i18n.t('hello')} {username},
          </PText>
        )}
        <Logo />
        <DashboardOptions
          theme={theme}
          onFileComplaint={() => {
            navigation.navigate('FileComplaint');
          }}
          onViewStatus={() => {
            navigation.navigate('ListComplaints', {
              defaultFilter: i18n.t('all'),
            });
          }}
        />
      </View>
    </>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      margin: 10,
    },
    logoContainer: {
      width: '100%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.xthick,
      fontWeight: '600',
      marginTop: 5,
    },
  });
export default HomeScreen;
