import React from 'react';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import i18n from '../../i18n';
import {useTheme} from '../theme/ThemeProvider';

const AppLoadingScreen = () => {
  const theme = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text>{i18n.t('loading')}...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AppLoadingScreen;
