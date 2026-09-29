import {StyleSheet, View} from 'react-native';
import PText from './PText';
import React from 'react';
import {Theme} from '../theme/ThemeProvider';

const TitleDescriptionComponent = ({title, description, theme}) => {
  const styles = genereateStyles(theme);
  return (
    <View style={styles.container}>
      <PText style={styles.title} theme={theme}>
        {title}
      </PText>
      <PText style={styles.description} theme={theme}>
        {description}
      </PText>
    </View>
  );
};
const genereateStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '55%',
      marginTop: 15,
    },
    title: {
      color: theme.colors.gray,
      fontSize: 16,
    },
    description: {
      color: theme.colors.textcolor,
      fontSize: 14,
    },
  });
export default TitleDescriptionComponent;
