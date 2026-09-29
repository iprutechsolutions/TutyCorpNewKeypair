import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import LogoutModel from '../components/LogoutModel';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../store/auth-context';

const LogoutScreen = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setVisible(isFocused);
  }, [isFocused]);
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <LogoutModel
        visible={visible}
        onClose={() => {
          setVisible(false);
          navigation.navigate('HomeScreenTab');
        }}
        onLogout={() => {
          authCtx.logout();
        }}
        theme={theme}></LogoutModel>
    </>
  );
};

export default LogoutScreen;
